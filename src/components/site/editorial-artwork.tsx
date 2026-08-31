import Image from 'next/image'

type Variant = 'workbench' | 'systems' | 'company'

const panelNumber: Record<Variant, string> = {
  workbench: '01',
  systems: '02',
  company: '03',
}

export function EditorialArtwork({
  variant,
  alt,
  caption,
  priority = false,
}: {
  variant: Variant
  alt: string
  caption: string
  priority?: boolean
}) {
  return (
    <figure className={`editorial-art editorial-art--${variant}`}>
      <div className="editorial-art__viewport">
        <Image
          alt={alt}
          className="editorial-art__image"
          height={724}
          priority={priority}
          sizes="(max-width: 820px) 100vw, 570px"
          src="/images/integrated-work-triptych.webp"
          width={2172}
        />
      </div>
      <figcaption>
        <span>{panelNumber[variant]} / 03</span>
        <p>{caption}</p>
      </figcaption>
    </figure>
  )
}
