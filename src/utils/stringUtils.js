/**
 * Utilitários para manipulação de strings
 */

/**
 * Normaliza uma string removendo acentos e convertendo para minúsculas
 * @param {string} str - String a ser normalizada
 * @returns {string} String normalizada
 */
export function normalizeString(str) {
  if (!str || typeof str !== 'string') return ''
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

/**
 * Gera um slug amigável a partir de uma string
 * @param {string} str - String a ser convertida em slug
 * @returns {string} Slug gerado
 */
export function generateSlug(str) {
  if (!str || typeof str !== 'string') return ''
  
  return str
    .normalize('NFD') // Remove acentos
    .replace(/[\u0300-\u036f]/g, '') // Remove diacríticos
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove caracteres especiais exceto letras, números, espaços e hífens
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-') // Remove hífens duplicados
    .replace(/^-+|-+$/g, '') // Remove hífens no início e fim
}

