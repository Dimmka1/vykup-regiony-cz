import Image from "next/image";

interface HeroImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export function HeroImage({ src, alt, className, priority }: HeroImageProps) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 scale-105">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          className={className}
          sizes="100vw"
          quality={75}
        />
      </div>
      {/* Cinematic vignette overlay for depth */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(2,6,23,0.5) 100%)",
        }}
        aria-hidden="true"
      />
    </div>
  );
}
