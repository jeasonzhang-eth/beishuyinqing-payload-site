import type { Language } from '@/lib/site/routes'

type Props = {
  ariaLabel: string
  lines: string[]
  id?: string
  variant?: 'hero' | 'page'
  language: Language
}

export function DisplayHeadline({ ariaLabel, lines, id, variant = 'page', language }: Props) {
  return (
    <h1
      aria-label={ariaLabel}
      className="display-headline"
      data-language={language}
      data-variant={variant}
      id={id}
    >
      {lines.map((line) => (
        <span aria-hidden="true" className="headline-line" key={line}>
          {line}
        </span>
      ))}
    </h1>
  )
}
