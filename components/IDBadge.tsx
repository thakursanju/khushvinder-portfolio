'use client';

// IDBadge — a draggable conference badge hanging from a real rope, rendered
// with Verlet integration (no physics library required).
//
// ┌──────────────────────────────────────────────────────────────────────────┐
// │ ARCHITECTURE                                                             │
// │                                                                          │
// │  • An array of "points" (x, y, oldX, oldY) forms a chain.                │
// │  • Verlet step: new = pos + (pos - oldPos)*friction + gravity            │
// │    velocity is implicit in the (pos - oldPos) delta — no Δt to manage.   │
// │  • Constraint pass: for each segment, snap the two endpoints back to the │
// │    desired rest length. Multiple iterations converge to a rope shape.    │
// │  • Anchor point is pinned to the top of the wrapper. While dragging, the │
// │    tail point is pinned to the cursor — the rope follows naturally.      │
// │  • All animation happens in a requestAnimationFrame loop that mutates    │
// │    refs and writes directly to the badge's transform + the SVG path's    │
// │    `d` attribute. React never re-renders, so it's cheap.                 │
// │                                                                          │
// │ INPUTS                                                                   │
// │  • Cursor   : pointermove → wrapper-local coords                         │
// │  • Drag     : pointerdown on badge → tail pinned to cursor               │
// │  • Scroll   : window scroll → adds vertical impulse to rope points       │
// │                                                                          │
// │ 3D treatment                                                             │
// │  • `perspective: 1000px` on the wrapper (origin biased toward the top).  │
// │  • Both the badge AND its body carry `transform-style: preserve-3d`, so  │
// │    the inner layers stack in real depth: edge slab -10, body 12, barcode │
// │    +10, name +20, avatar +30, sheen +34. Turning the card parallaxes     │
// │    them against each other.                                              │
// │  • A darker "edge" slab sits behind the face to sell card thickness when │
// │    it tilts; a specular sheen band sweeps across as yaw changes.         │
// │  • Yaw = physics twist (horizontal tail velocity) + a cursor look-around │
// │    lean, so the card leans toward the pointer. Pitch (rotateX) likewise. │
// │  • The cord renders as two SVG strokes — a dark base + a thin highlight  │
// │    — giving a cylindrical look.                                          │
// └──────────────────────────────────────────────────────────────────────────┘

import React, { useEffect, useRef } from 'react';

// --- Tunables ---------------------------------------------------------------
// Goal: heavily-damped rope that bends naturally but settles without ringing.
// Key idea: lots of iterations × small per-iter correction distributes the
// constraint smoothly, so the rope never *snaps*. Friction does the rest.
const NUM_SEGMENTS = 18;
const SEGMENT_LEN = 5.5;
const ITERATIONS = 18;
const STIFFNESS = 0.32;      // small per-iter correction → smooth convergence
const GRAVITY = 0.34;
const FRICTION = 0.86;       // strong velocity decay → near-critical damping
const MAX_VEL = 10;          // hard cap per axis — prevents whip-crack frames
const TAIL_FOLLOW = 0.55;
const ANGLE_LERP = 0.22;

// Cursor look-around tilt (deg). Gentle + heavily lerped so it reads as the
// card calmly leaning toward the pointer rather than tracking it twitchily.
const TILT_MAX = 14;
const TILT_GAIN = 0.06;
const TILT_LERP = 0.08;

const WRAPPER_W = 360;
const WRAPPER_H = 400;
const ANCHOR_X = WRAPPER_W / 2;
const ANCHOR_Y = 10;

const BADGE_W = 280;
// Rough vertical offset from the badge's top (where it pins to the cord) to
// its visual centre — used to decide which way the cursor lean tips the card.
const BADGE_CENTER_Y = 170;

const BARCODE_WIDTHS = [2, 1, 3, 1, 2, 1, 3, 2, 1, 2, 3, 1, 1, 2, 3, 2, 1, 3, 1, 2, 2, 1];

// Branding printed down the strap. We place each glyph individually along the
// rope every frame (see the loop) rather than using an SVG <textPath>: Blink
// (Chrome/Edge) doesn't re-layout a textPath when the referenced path's `d`
// changes imperatively, so the print would stay frozen on the initial shape.
// The font is monospace, so every glyph advances by the same fixed amount.
const BRAND_CHARS = 'JARED · BERESFORD · '.repeat(2).split('');
const BRAND_START = 8;     // px from the anchor before the first glyph
const BRAND_ADVANCE = 3.6; // px between glyph centres (monospace ⇒ constant)

type Point = { x: number; y: number; ox: number; oy: number };

export default function IDBadge({ scale = 1 }: { scale?: number }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const pathBaseRef = useRef<SVGPathElement>(null);
  const pathHighlightRef = useRef<SVGPathElement>(null);
  const brandRef = useRef<SVGGElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  // Mutable refs — these change every frame but never trigger re-renders.
  const pointsRef = useRef<Point[]>([]);
  const draggingRef = useRef(false);
  const cursorRef = useRef({ x: ANCHOR_X, y: ANCHOR_Y + NUM_SEGMENTS * SEGMENT_LEN });
  const yawRef = useRef({ value: 0, velocity: 0 });
  const angleRef = useRef(0); // smoothed badge heading, EMA across frames
  // Cursor-driven look-around tilt, smoothed across frames. The card leans
  // toward the pointer so it reads as a solid object you can peer around.
  const tiltRef = useRef({ x: 0, y: 0 });

  // Initialise the rope once.
  if (pointsRef.current.length === 0) {
    for (let i = 0; i <= NUM_SEGMENTS; i++) {
      const y = ANCHOR_Y + i * SEGMENT_LEN;
      pointsRef.current.push({ x: ANCHOR_X, y, ox: ANCHOR_X, oy: y });
    }
  }

  // Pointer + scroll handlers (set up once).
  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      if (!wrapperRef.current) return;
      const rect = wrapperRef.current.getBoundingClientRect();
      // rect is measured in real (post-zoom) screen pixels, but every other
      // coordinate here (ANCHOR_X, the rope points, BADGE_W...) lives in the
      // component's own unzoomed pixel space. Divide by `scale` so a badge
      // shrunk via CSS `zoom` still tracks the cursor 1:1 instead of the rope
      // chasing a target that's off by the zoom factor.
      cursorRef.current = {
        x: (e.clientX - rect.left) / scale,
        y: (e.clientY - rect.top) / scale,
      };
    };

    const onPointerDown = (e: PointerEvent) => {
      draggingRef.current = true;
      try {
        (e.target as Element)?.setPointerCapture?.(e.pointerId);
      } catch {
        /* window listeners cover the fallback */
      }
      e.preventDefault();
    };

    const onPointerUp = () => {
      draggingRef.current = false;
    };

    // Scroll → impulse: shift `oy` so each point's implicit velocity changes,
    // making the whole rope bounce in response to scroll motion.
    let lastScroll = window.scrollY;
    const onScroll = () => {
      const dy = window.scrollY - lastScroll;
      lastScroll = window.scrollY;
      if (Math.abs(dy) < 0.5) return;
      const pts = pointsRef.current;
      // Gentle nudge — friction will quickly damp it out.
      const impulse = Math.max(-5, Math.min(5, dy * 0.22));
      for (let i = 1; i < pts.length; i++) {
        const weight = i / pts.length;
        pts[i].oy += impulse * (0.3 + weight * 0.5);
      }
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
    window.addEventListener('scroll', onScroll, { passive: true });

    const badge = badgeRef.current;
    badge?.addEventListener('pointerdown', onPointerDown);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
      window.removeEventListener('scroll', onScroll);
      badge?.removeEventListener('pointerdown', onPointerDown);
    };
  }, [scale]);

  // Main animation loop — runs every frame, mutates refs, no React re-render.
  useEffect(() => {
    let rafId = 0;

    // Tiny push on first mount so it's clearly alive — gentle enough that the
    // rope doesn't snap, just barely drifts and settles.
    const seedKick = () => {
      const pts = pointsRef.current;
      for (let i = 1; i < pts.length; i++) {
        const weight = i / pts.length;
        pts[i].ox += 2.5 * weight;
      }
    };
    seedKick();

    const tick = () => {
      const pts = pointsRef.current;

      // 1. Verlet integration (skip anchor at index 0). Velocity is clamped
      //    per axis so a single big constraint correction can't whip-crack a
      //    point across the screen in one frame.
      for (let i = 1; i < pts.length; i++) {
        const p = pts[i];
        let vx = (p.x - p.ox) * FRICTION;
        let vy = (p.y - p.oy) * FRICTION;
        if (vx >  MAX_VEL) vx =  MAX_VEL; else if (vx < -MAX_VEL) vx = -MAX_VEL;
        if (vy >  MAX_VEL) vy =  MAX_VEL; else if (vy < -MAX_VEL) vy = -MAX_VEL;
        p.ox = p.x;
        p.oy = p.y;
        p.x += vx;
        p.y += vy + GRAVITY;
      }

      // Pin anchor every frame.
      pts[0].x = ANCHOR_X;
      pts[0].y = ANCHOR_Y;
      pts[0].ox = ANCHOR_X;
      pts[0].oy = ANCHOR_Y;

      // While dragging, *soft*-pin the tail toward the cursor — lerp instead of
      // snap so the tail feels like it has weight on the end of the rope.
      if (draggingRef.current) {
        const tail = pts[pts.length - 1];
        tail.x += (cursorRef.current.x - tail.x) * TAIL_FOLLOW;
        tail.y += (cursorRef.current.y - tail.y) * TAIL_FOLLOW;
      }

      // 2. Soft constraint passes — each iteration corrects only a fraction
      //    (STIFFNESS) of the over/understretch. Combined with few iterations,
      //    the rope visibly bows when accelerated instead of snapping rigid.
      const lastIdx = pts.length - 1;

      for (let iter = 0; iter < ITERATIONS; iter++) {
        for (let i = 0; i < pts.length - 1; i++) {
          const p1 = pts[i];
          const p2 = pts[i + 1];
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.0001;
          const diff = ((dist - SEGMENT_LEN) / dist) * STIFFNESS;

          // Only the anchor is hard-pinned. The tail uses soft-follow during
          // drag (above), so it still participates in constraint solving.
          if (i === 0) {
            p2.x -= dx * diff;
            p2.y -= dy * diff;
          } else {
            p1.x += dx * diff * 0.5;
            p1.y += dy * diff * 0.5;
            p2.x -= dx * diff * 0.5;
            p2.y -= dy * diff * 0.5;
          }
        }
        // Re-pin anchor after each pass.
        pts[0].x = ANCHOR_X;
        pts[0].y = ANCHOR_Y;
      }

      // 3. Yaw — driven by horizontal velocity at the tail. Slow lerp +
      // strong damping = it eases in and out rather than snapping.
      const tail = pts[lastIdx];
      const tailVx = tail.x - tail.ox;
      const targetYaw = Math.max(-28, Math.min(28, tailVx * 2.8));
      yawRef.current.velocity += (targetYaw - yawRef.current.value) * 0.07;
      yawRef.current.velocity *= 0.9;
      yawRef.current.value += yawRef.current.velocity;

      // 4. Build a smooth path through the points — quadratic Beziers between
      //    midpoints, using each point as the control. The result is a single
      //    fluid curve instead of a polyline.
      if (pathBaseRef.current && pathHighlightRef.current) {
        let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
        if (pts.length > 2) {
          // Line to the first midpoint, then quadratics through subsequent ones.
          const m0x = (pts[0].x + pts[1].x) / 2;
          const m0y = (pts[0].y + pts[1].y) / 2;
          d += ` L ${m0x.toFixed(2)} ${m0y.toFixed(2)}`;
          for (let i = 1; i < pts.length - 1; i++) {
            const mx = (pts[i].x + pts[i + 1].x) / 2;
            const my = (pts[i].y + pts[i + 1].y) / 2;
            d += ` Q ${pts[i].x.toFixed(2)} ${pts[i].y.toFixed(2)} ${mx.toFixed(2)} ${my.toFixed(2)}`;
          }
          d += ` L ${pts[lastIdx].x.toFixed(2)} ${pts[lastIdx].y.toFixed(2)}`;
        } else {
          for (let i = 1; i < pts.length; i++) {
            d += ` L ${pts[i].x.toFixed(2)} ${pts[i].y.toFixed(2)}`;
          }
        }
        pathBaseRef.current.setAttribute('d', d);
        pathHighlightRef.current.setAttribute('d', d);
      }

      // 4b. Lay the branding glyphs along the rope polyline. Walk cumulative
      //     arc length once, then for each glyph find its point + tangent and
      //     write an individual transform. This tracks the physics exactly
      //     because it reads the same points that drew the strap.
      if (brandRef.current) {
        const glyphs = brandRef.current.children;
        const cum = [0];
        for (let i = 0; i < pts.length - 1; i++) {
          cum.push(cum[i] + Math.hypot(pts[i + 1].x - pts[i].x, pts[i + 1].y - pts[i].y));
        }
        const total = cum[cum.length - 1];
        let seg = 0;
        for (let i = 0; i < glyphs.length; i++) {
          const el = glyphs[i] as SVGTextElement;
          const target = BRAND_START + i * BRAND_ADVANCE;
          if (target > total) {
            el.setAttribute('opacity', '0');
            continue;
          }
          while (seg < pts.length - 2 && cum[seg + 1] < target) seg++;
          const a = pts[seg];
          const b = pts[seg + 1];
          const segLen = (cum[seg + 1] - cum[seg]) || 0.0001;
          const tt = (target - cum[seg]) / segLen;
          const x = a.x + (b.x - a.x) * tt;
          const y = a.y + (b.y - a.y) * tt;
          const ang = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
          el.setAttribute('opacity', '1');
          el.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${ang.toFixed(2)})`);
        }
      }

      // 5. Badge transform — average the last few segments for a smoother
      //    heading, then EMA across frames so the badge doesn't twitch when
      //    individual rope points jitter.
      if (badgeRef.current) {
        const last = pts[lastIdx];
        // Average direction of the last 3 segments — smoother than 1.
        let sumDx = 0;
        let sumDy = 0;
        for (let i = lastIdx - 3; i < lastIdx; i++) {
          if (i < 0) continue;
          sumDx += pts[i + 1].x - pts[i].x;
          sumDy += pts[i + 1].y - pts[i].y;
        }
        const rawAngle = (Math.atan2(sumDx, sumDy) * 180) / Math.PI;
        // EMA smoothing so high-frequency jitter doesn't reach the badge.
        angleRef.current += (rawAngle - angleRef.current) * ANGLE_LERP;

        // Look-around tilt: lean the card toward the cursor. Measured from the
        // badge's approximate centre (tail point + half the body height) so the
        // pointer "pushes" whichever edge it's nearest. Disabled while dragging
        // — there the cursor *is* the badge, so a tilt would just be noise.
        let tgtX = 0;
        let tgtY = 0;
        if (!draggingRef.current) {
          const dcx = cursorRef.current.x - last.x;
          const dcy = cursorRef.current.y - (last.y + BADGE_CENTER_Y);
          tgtY = Math.max(-TILT_MAX, Math.min(TILT_MAX, dcx * TILT_GAIN));
          tgtX = Math.max(-TILT_MAX, Math.min(TILT_MAX, -dcy * TILT_GAIN));
        }
        tiltRef.current.x += (tgtX - tiltRef.current.x) * TILT_LERP;
        tiltRef.current.y += (tgtY - tiltRef.current.y) * TILT_LERP;

        // Total yaw = physics twist + cursor lean. Drive the sheen from it so
        // the specular band sweeps across the card face as it turns.
        const yaw = yawRef.current.value + tiltRef.current.y;
        if (glareRef.current) {
          const sweep = 50 - yaw * 2.2; // band centre, % across the card
          glareRef.current.style.background =
            `linear-gradient(105deg,` +
            ` rgba(255,255,255,0) ${(sweep - 38).toFixed(1)}%,` +
            ` rgba(255,255,255,0.14) ${sweep.toFixed(1)}%,` +
            ` rgba(255,255,255,0) ${(sweep + 38).toFixed(1)}%)`;
        }

        badgeRef.current.style.transform =
          `translate3d(${last.x.toFixed(2)}px, ${last.y.toFixed(2)}px, 0)` +
          ` translate(-50%, 0)` +
          ` rotate(${angleRef.current.toFixed(2)}deg)` +
          ` rotateY(${yaw.toFixed(2)}deg)` +
          ` rotateX(${tiltRef.current.x.toFixed(2)}deg)`;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative select-none touch-none"
      style={{
        width: WRAPPER_W,
        height: WRAPPER_H,
        perspective: '1000px',
        perspectiveOrigin: '50% 35%',
      }}
    >
      {/* Anchor pin — fixed at the top of the wrapper */}
      <div
        aria-hidden
        className="absolute rounded-full ring-2 ring-cream-50/80"
        style={{
          left: ANCHOR_X - 7,
          top: ANCHOR_Y - 7,
          width: 14,
          height: 14,
          background: 'radial-gradient(circle at 30% 30%, #5a5a5a 0%, #1a1a1a 55%, #050505 100%)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.5), inset -1px -1px 1px rgba(0,0,0,0.6)',
        }}
      />

      {/* Lanyard ribbon — wide flat strap with branding printed along it.
          Three layers: dark base (the strap), a soft highlight, and a row of
          individually-positioned glyphs spelling "JARED · BERESFORD" repeated
          down the ribbon. The glyphs are placed each frame in the rAF loop so
          the print follows the rope physics (see note on BRAND_CHARS). */}
      <svg
        width={WRAPPER_W}
        height={WRAPPER_H}
        className="absolute inset-0 pointer-events-none"
        style={{ overflow: 'visible' }}
      >
        {/* The strap itself. Solid fill, not a gradient: an SVG gradient with
            the default objectBoundingBox units collapses to nothing when the
            rope hangs straight (zero-width bbox), which made the lanyard
            invisible at rest. A flat color always paints; the highlight line
            below still gives it a hint of dimension. */}
        <path
          ref={pathBaseRef}
          id="cord-path"
          stroke="#23201b"
          strokeWidth={14}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Subtle highlight running just inside the strap's right edge */}
        <path
          ref={pathHighlightRef}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={1.5}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transform: 'translateX(-3px)' }}
        />
        {/* Printed branding — each glyph is transformed individually in the
            loop so the text bends and swings with the strap. */}
        <g
          ref={brandRef}
          fill="rgba(245,239,230,0.6)"
          fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
          fontSize="5"
          fontWeight={700}
          textAnchor="middle"
        >
          {BRAND_CHARS.map((ch, i) => (
            <text key={i} dominantBaseline="central" opacity="0">
              {ch}
            </text>
          ))}
        </g>
      </svg>

      {/* Badge body — positioned imperatively each frame; the wrapper takes 3D */}
      <div
        ref={badgeRef}
        className="absolute top-0 left-0 cursor-grab active:cursor-grabbing"
        style={{
          width: BADGE_W,
          transformOrigin: 'top center',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        {/* Cord clip — beveled metal hardware where the strap meets the badge.
            Wider than the ribbon so it visually "grips" the lanyard. */}
        <div className="flex justify-center" style={{ transform: 'translateZ(4px)' }}>
          <div
            aria-hidden
            className="w-14 h-3.5 rounded-sm"
            style={{
              background: 'linear-gradient(to bottom, #6a6a6a 0%, #3a3a3a 40%, #1a1a1a 100%)',
              boxShadow:
                '0 1px 2px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(0,0,0,0.55)',
            }}
          />
        </div>

        {/* Badge body — stacked shadows + a real edge layer simulate card
            thickness; preserve-3d lets the inner layers (barcode, avatar, name)
            sit at their own depths so they parallax as the card turns. */}
        <div
          className="bg-ink-900 text-cream-100 rounded-2xl pt-5 pb-9 px-5 w-[280px] relative -mt-0.5"
          style={{
            transform: 'translateZ(12px)',
            transformStyle: 'preserve-3d',
            boxShadow:
              'inset 0 1px 0 rgba(255,255,255,0.10),' +
              ' inset 0 -1px 0 rgba(0,0,0,0.6),' +
              ' inset 1px 0 0 rgba(255,255,255,0.04),' +
              ' inset -1px 0 0 rgba(0,0,0,0.5),' +
              ' 0 2px 0 rgba(0,0,0,0.55),' +
              ' 0 6px 0 #070707,' +
              ' 0 10px 0 #050505,' +
              ' 0 22px 40px -6px rgba(0,0,0,0.55)',
          }}
        >
          {/* Card edge — a darker slab a few px behind the face. When the card
              yaws/tilts you see this rim, selling real thickness. */}
          <div
            aria-hidden
            className="absolute -inset-px rounded-2xl pointer-events-none"
            style={{
              transform: 'translateZ(-10px)',
              background: 'linear-gradient(to bottom, #161412 0%, #060606 100%)',
              boxShadow: '0 0 0 1px rgba(0,0,0,0.8)',
            }}
          />

          {/* Gloss highlight at the top */}
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-16 rounded-t-2xl pointer-events-none"
            style={{
              transform: 'translateZ(2px)',
              background:
                'linear-gradient(to bottom, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 100%)',
            }}
          />

          {/* Moving specular sheen — its band position is driven by the card's
              yaw in the rAF loop, so light sweeps across the face as it turns. */}
          <div
            ref={glareRef}
            aria-hidden
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{ transform: 'translateZ(34px)', mixBlendMode: 'screen' }}
          />

          {/* Barcode */}
          <div className="flex items-end gap-[2px] h-7 mb-4" style={{ transform: 'translateZ(10px)' }}>
            {BARCODE_WIDTHS.map((w, i) => (
              <div
                key={i}
                className="bg-cream-100"
                style={{ width: `${w}px`, height: '28px' }}
              />
            ))}
          </div>

          {/* Avatar — sits forward of the badge plane */}
          {/* Wrapper handles the circle crop + 3D translateZ; the inner <img>
              is scaled up so the face fills the circle rather than the whole
              photo getting fit-to-frame. */}
          <div
            className="w-20 h-20 rounded-full ring-4 ring-cream-100/20 mx-auto overflow-hidden bg-cream-200"
            style={{
              transform: 'translateZ(30px)',
              boxShadow: '0 10px 18px -6px rgba(0,0,0,0.6)',
            }}
          >
            <img
              src="/images/avatar.png"
              alt="Khushvinder Thakur"
              draggable={false}
              className="w-full h-full object-cover pointer-events-none"
              style={{ transform: 'scale(1.15)', transformOrigin: 'center 35%' }}
            />
          </div>

          <div className="mt-4 mb-2 text-center" style={{ transform: 'translateZ(20px)' }}>
            <div className="text-3xl font-bold leading-tight">Khushvinder</div>
            <div className="font-mono text-sm text-cream-100/70 mt-1">Khushvinder Thakur</div>
          </div>
        </div>
      </div>
    </div>
  );
}
