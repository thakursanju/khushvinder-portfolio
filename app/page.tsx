import NavBar from '@/components/NavBar';
import HeroSection from '@/components/HeroSection';
import SnapshotSection from '@/components/SnapshotSection';
import WorkSection from '@/components/WorkSection';
import ExperienceSection from '@/components/ExperienceSection';
import PlaygroundSection from '@/components/PlaygroundSection';
import Footer from '@/components/Footer';

/*
 * Single-page composition. Each section is self-contained; the page just
 * stacks them. Scroll-snap is intentionally NOT used — we want a continuous
 * "field notebook" reading experience rather than discrete panels.
 */
export default function Page() {
  return (
    <main className="relative">
      <NavBar />
      <HeroSection />
      <SnapshotSection />
      <WorkSection />
      <ExperienceSection />
      <PlaygroundSection />
      <Footer />
    </main>
  );
}
