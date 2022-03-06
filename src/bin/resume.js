import { FIRST_NAME, DOMAIN } from '@/config'

export default async ({ output }) => {
    window.open(`https://cdn.${DOMAIN}/${FIRST_NAME.toLowerCase()}-sapan-resume-2022.pdf`, '_blank')
    await output('Opening resume...')
}
