import { describe, expect, it } from 'vitest'

import { portableTextToLexical } from '@/migration/portable-text-to-lexical'

const span = (text: string) => ({ _key: text, _type: 'span', marks: [], text })

describe('Portable Text to Lexical conversion', () => {
  it('converts headings, paragraphs, and adjacent list items', () => {
    const result = portableTextToLexical([
      { _key: 'h', _type: 'block', style: 'h2', markDefs: [], children: [span('Overview')] },
      { _key: 'p', _type: 'block', style: 'normal', markDefs: [], children: [span('Body')] },
      { _key: 'a', _type: 'block', style: 'normal', listItem: 'bullet', level: 1, markDefs: [], children: [span('One')] },
      { _key: 'b', _type: 'block', style: 'normal', listItem: 'bullet', level: 1, markDefs: [], children: [span('Two')] },
    ])

    expect(result.root.children.map((node) => node.type)).toEqual(['heading', 'paragraph', 'list'])
    expect(result.root.children[2]).toEqual(
      expect.objectContaining({ listType: 'bullet', tag: 'ul', start: 1 }),
    )
    expect(result.root.children[2].children).toHaveLength(2)
  })

  it('rejects unsupported source blocks instead of dropping content', () => {
    expect(() => portableTextToLexical([{ _type: 'image' }])).toThrow(
      'Unsupported Portable Text block image',
    )
  })
})
