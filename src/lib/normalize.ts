export function normalizeText(s: string) {
    return s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
}