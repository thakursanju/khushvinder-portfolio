'use client';

// FuelRadar: a small recharts radar visualising PM competency mix. Recharts
// handles the polar math; we feed it a tiny dataset and theme the axis ticks
// with mono type so it sits inside the cream "card" cohesively.
//
// SAMPLE VALUES (0–100, self-assessed). Adjust to your real strengths.

import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { label: 'Discovery', value: 85 },
  { label: 'Strategy', value: 80 },
  { label: 'Execution', value: 90 },
  { label: 'Analytics', value: 78 },
  { label: 'Comms', value: 88 },
  { label: 'Design', value: 72 },
];

function FuelRadar() {
  return (
    <div className="bg-cream-50 border border-ink-900/10 rounded-lg p-4">
      <div className="font-mono text-xs uppercase tracking-wider text-ink-900/60 mb-3">
        Product skills
      </div>
      <div style={{ width: '100%', height: 160 }}>
        <ResponsiveContainer width="100%" height={160}>
          <RadarChart data={data} outerRadius="75%">
            <PolarGrid stroke="#3D3830" strokeOpacity={0.15} />
            <PolarAngleAxis
              dataKey="label"
              tick={{
                fontSize: 10,
                fill: '#3D3830',
                fontFamily: 'var(--font-mono)',
              }}
            />
            <Radar
              dataKey="value"
              stroke="#FF8C7A"
              fill="rgba(255,140,122,0.25)"
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default FuelRadar;
