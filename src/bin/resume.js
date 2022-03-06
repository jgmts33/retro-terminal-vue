import { FIRST_NAME, CDN_URL } from '@/config'

export default async ({ output }) => {
    window.open(`${CDN_URL}/${FIRST_NAME.toLowerCase()}-sapan-resume-2022.pdf`, '_blank')
    await output('Opening resume...')
}
