function formatRange(start, end) {
  if (!start && !end) return ''
  const s = new Date(start)
  const e = end ? new Date(end) : null
  const f = { day: '2-digit', month: '2-digit', year: 'numeric' }
  const sStr = s.toLocaleDateString('pt-BR', f)
  const eStr = e ? e.toLocaleDateString('pt-BR', f) : null
  return eStr && eStr !== sStr ? `${sStr} - ${eStr}` : sStr
}

export function toEventCardFromSb(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    date: formatRange(row.start_date, row.end_date),
    location: [row.location, row.city, row.state].filter(Boolean).join(' - '),
    image: row.image_url || '/logo.svg',
    link: { name: 'event-detail', params: { id: row.id } },
  }
}

export function toEventDetailFromSb(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    highlight: row.highlight,
    additional_info: row.additional_info,
    date: formatRange(row.start_date, row.end_date),
    location: [row.location, row.city, row.state].filter(Boolean).join(' - '),
    images: Array.isArray(row.images) ? row.images : [],
    tags: Array.isArray(row.tags) ? row.tags.map((t) => t.name) : [],
    whatsapp: row.whatsapp || null,
    whatsapp_message: row.whatsapp_message || null,
    share_url: row.share_url || null,
  }
}
