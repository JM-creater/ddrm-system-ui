export const DIRECTORY_TITLE = 'Evacuation & Hotlines'
export const DIRECTORY_SUBTITLE = 'Know where to go and who to call. Save these numbers on your phone.'

export const telHref = (n: string) => `tel:${n.replace(/[^\d+]/g, '')}`
