import Image from 'next/image'

import type { Language } from '@/lib/site/routes'

export function BrandLogo({
  tone = 'color',
  className = '',
  priority = false,
}: {
  tone?: 'color' | 'white'
  className?: string
  priority?: boolean
}) {
  return (
    <Image
      alt="倍数引擎 / Multiple Engine"
      className={className}
      height={180}
      priority={priority}
      src={`/brand/wordmark-${tone}.svg`}
      unoptimized
      width={600}
    />
  )
}

export function BrandMark({
  tone = 'color',
  className = '',
  priority = false,
}: {
  tone?: 'color' | 'white'
  className?: string
  priority?: boolean
}) {
  return (
    <Image
      alt="倍数引擎核心图标"
      className={className}
      height={120}
      priority={priority}
      src={`/brand/mark-${tone}.svg`}
      unoptimized
      width={120}
    />
  )
}

export function CapabilityIcon({ index }: { index: number }) {
  const variant = index % 4
  return (
    <svg
      aria-hidden="true"
      className={`capability-icon capability-icon--${variant + 1}`}
      viewBox="0 0 120 120"
    >
      {variant === 0 && (
        <>
          <g fill="#155EEF" transform="rotate(45 60 60)">
            <rect height="18" rx="3" width="34" x="8" y="51" />
            <rect height="18" rx="3" width="34" x="78" y="51" />
          </g>
          <g fill="#202936" transform="rotate(-45 60 60)">
            <rect height="18" rx="3" width="34" x="8" y="51" />
            <rect height="18" rx="3" width="34" x="78" y="51" />
          </g>
          <rect
            fill="#12BFA5"
            height="14"
            rx="2"
            transform="rotate(45 60 60)"
            width="14"
            x="53"
            y="53"
          />
        </>
      )}
      {variant === 1 && (
        <>
          <g fill="#155EEF" transform="rotate(45 60 60)">
            <rect height="18" rx="3" width="38" x="10" y="51" />
            <rect height="18" rx="3" width="38" x="72" y="51" />
          </g>
          <g fill="#202936" transform="rotate(-45 60 60)">
            <rect height="18" rx="3" width="38" x="10" y="51" />
            <rect height="18" rx="3" width="38" x="72" y="51" />
          </g>
          <rect
            fill="#F5F7FA"
            height="18"
            rx="2"
            stroke="#12BFA5"
            strokeWidth="6"
            transform="rotate(45 60 60)"
            width="18"
            x="51"
            y="51"
          />
        </>
      )}
      {variant === 2 && (
        <>
          <g fill="#C9D8F7" transform="rotate(45 60 60)">
            <rect height="14" rx="3" width="25" x="-2" y="53" />
            <rect height="14" rx="3" width="25" x="97" y="53" />
          </g>
          <g fill="#D8DEE6" transform="rotate(-45 60 60)">
            <rect height="14" rx="3" width="25" x="-2" y="53" />
            <rect height="14" rx="3" width="25" x="97" y="53" />
          </g>
          <g fill="#155EEF" transform="rotate(45 60 60)">
            <rect height="18" rx="3" width="30" x="18" y="51" />
            <rect height="18" rx="3" width="30" x="72" y="51" />
          </g>
          <g fill="#202936" transform="rotate(-45 60 60)">
            <rect height="18" rx="3" width="30" x="18" y="51" />
            <rect height="18" rx="3" width="30" x="72" y="51" />
          </g>
          <rect
            fill="#12BFA5"
            height="16"
            rx="2"
            transform="rotate(45 60 60)"
            width="16"
            x="52"
            y="52"
          />
        </>
      )}
      {variant === 3 && (
        <>
          <g fill="#155EEF" transform="rotate(45 60 60)">
            <rect height="18" rx="3" width="32" x="7" y="51" />
            <rect height="18" rx="3" width="32" x="81" y="51" />
          </g>
          <g fill="#202936" transform="rotate(-45 60 60)">
            <rect height="18" rx="3" width="32" x="17" y="51" />
            <rect height="18" rx="3" width="32" x="71" y="51" />
          </g>
          <rect
            fill="#12BFA5"
            height="15"
            rx="2"
            transform="rotate(45 60 60)"
            width="15"
            x="52.5"
            y="52.5"
          />
        </>
      )}
    </svg>
  )
}

const fieldLabels = {
  zh: ['输入', '工具', '流程', '执行'],
  en: ['Input', 'Tools', 'Flow', 'Execution'],
} satisfies Record<Language, string[]>

export function BrandField({
  language,
  variant = 'hero',
}: {
  language: Language
  variant?: 'hero' | 'systems' | 'company'
}) {
  return (
    <figure
      aria-label={
        language === 'zh' ? '倍数引擎四臂一核品牌图形' : 'Multiple Engine four-arm brand system'
      }
      className={`brand-field brand-field--${variant}`}
    >
      <div className="brand-field__canvas">
        <span aria-hidden="true" className="brand-field__axis brand-field__axis--horizontal" />
        <span aria-hidden="true" className="brand-field__axis brand-field__axis--vertical" />
        <BrandMark className="brand-field__mark" priority={variant === 'hero'} />
        {fieldLabels[language].map((label, index) => (
          <span className={`brand-field__label brand-field__label--${index + 1}`} key={label}>
            <small>0{index + 1}</small>
            {label}
          </span>
        ))}
        <span aria-hidden="true" className="brand-field__node brand-field__node--1" />
        <span aria-hidden="true" className="brand-field__node brand-field__node--2" />
      </div>
      <figcaption>
        <span>{language === 'zh' ? '四臂 × 一核' : 'Four arms x one core'}</span>
        <p>
          {language === 'zh'
            ? '让输入、工具、流程与执行围绕一个可检查的 AI 核心协同。'
            : 'Inputs, tools, workflows, and execution coordinated around one inspectable AI core.'}
        </p>
      </figcaption>
    </figure>
  )
}
