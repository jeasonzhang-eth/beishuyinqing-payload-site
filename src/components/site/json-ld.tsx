export function JsonLd({ data }: { data: object | object[] }) {
  const entries = Array.isArray(data) ? data : [data]
  return entries.map((entry, index) => (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(entry).replace(/</g, '\\u003c') }}
      key={index}
      type="application/ld+json"
    />
  ))
}
