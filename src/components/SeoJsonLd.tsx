import { buildJsonLdGraph } from '../config/jsonLd'

/** JSON-LD в DOM — попадает и в пререндер-снимок в index.html. */
export function SeoJsonLd() {
  const json = JSON.stringify(buildJsonLdGraph())
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  )
}
