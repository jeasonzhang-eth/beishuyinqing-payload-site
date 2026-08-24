type SourceRecord = Record<string, unknown>

export type LexicalNode = {
  type: string
  children: LexicalNode[]
  [key: string]: unknown
}

export type LexicalState = {
  root: LexicalNode
}

const textFormat = new Map([
  ['strong', 1],
  ['em', 2],
  ['strike-through', 4],
  ['underline', 8],
  ['code', 16],
])

function record(value: unknown, context: string): SourceRecord {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${context} must be an object`)
  }
  return value as SourceRecord
}

function sourceArray(value: unknown, context: string): SourceRecord[] {
  if (!Array.isArray(value)) throw new Error(`${context} must be an array`)
  return value.map((entry, index) => record(entry, `${context}[${index}]`))
}

function lexicalText(text: string, format = 0): LexicalNode {
  return {
    type: 'text',
    children: [],
    detail: 0,
    format,
    mode: 'normal',
    style: '',
    text,
    version: 1,
  }
}

function textChildren(block: SourceRecord): LexicalNode[] {
  const definitions = new Map(
    sourceArray(block.markDefs ?? [], 'Portable Text markDefs').map((definition) => [
      definition._key,
      definition,
    ]),
  )

  return sourceArray(block.children, 'Portable Text children').map((child) => {
    if (child._type !== 'span' || typeof child.text !== 'string') {
      throw new Error(`Unsupported Portable Text child ${String(child._type)}`)
    }
    const marks = Array.isArray(child.marks) ? child.marks : []
    let format = 0
    const annotations: SourceRecord[] = []
    for (const mark of marks) {
      if (typeof mark !== 'string') throw new Error('Portable Text mark must be a string')
      const bit = textFormat.get(mark)
      if (bit) format |= bit
      else {
        const annotation = definitions.get(mark)
        if (!annotation) throw new Error(`Unknown Portable Text mark ${mark}`)
        annotations.push(annotation)
      }
    }
    const node = lexicalText(child.text, format)
    if (annotations.length === 0) return node
    if (annotations.length > 1) throw new Error('Nested Portable Text annotations are unsupported')
    const annotation = annotations[0]
    if (annotation._type !== 'link' || typeof annotation.href !== 'string') {
      throw new Error(`Unsupported Portable Text annotation ${String(annotation._type)}`)
    }
    return {
      type: 'link',
      children: [node],
      direction: 'ltr',
      fields: {
        linkType: 'custom',
        newTab: Boolean(annotation.blank),
        url: annotation.href,
      },
      format: '',
      indent: 0,
      version: 2,
    }
  })
}

function element(type: string, children: LexicalNode[], extra: SourceRecord = {}): LexicalNode {
  return {
    type,
    children,
    direction: null,
    format: '',
    indent: 0,
    version: 1,
    ...extra,
  }
}

function blockNode(block: SourceRecord): LexicalNode {
  const style = block.style ?? 'normal'
  if (style === 'normal') {
    return element('paragraph', textChildren(block), { textFormat: 0, textStyle: '' })
  }
  if (style === 'h2') return element('heading', textChildren(block), { tag: 'h2' })
  throw new Error(`Unsupported Portable Text style ${String(style)}`)
}

function listNode(blocks: SourceRecord[], start: number): LexicalNode {
  const listItem = blocks[0].listItem
  const numbered = listItem === 'number'
  if (!numbered && listItem !== 'bullet') {
    throw new Error(`Unsupported Portable Text list ${String(listItem)}`)
  }
  for (const block of blocks) {
    if (block.listItem !== listItem || block.level !== 1) {
      throw new Error('Only contiguous level-one Portable Text lists are supported')
    }
  }
  return element(
    'list',
    blocks.map((block, index) =>
      element('listitem', textChildren(block), {
        checked: undefined,
        value: start + index,
      }),
    ),
    {
      listType: numbered ? 'number' : 'bullet',
      start,
      tag: numbered ? 'ol' : 'ul',
    },
  )
}

export function portableTextToLexical(value: unknown): LexicalState {
  const blocks = sourceArray(value, 'Portable Text')
  const children: LexicalNode[] = []
  for (let index = 0; index < blocks.length; index += 1) {
    const block = blocks[index]
    if (block._type !== 'block') {
      throw new Error(`Unsupported Portable Text block ${String(block._type)}`)
    }
    if (block.listItem) {
      const group = [block]
      while (blocks[index + 1]?.listItem === block.listItem) group.push(blocks[(index += 1)])
      children.push(listNode(group, 1))
    } else {
      children.push(blockNode(block))
    }
  }
  return {
    root: element('root', children),
  }
}
