import ParticleField from "@/components/landing/ParticleField";
import Hero from "@/components/landing/Hero";
import UploadZone from "@/components/landing/UploadZone";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-16">
      <ParticleField />
      <Hero />
      <UploadZone />
    </div>
  );
}
