import { FIRST_NAME, DOMAIN } from '@/config'

export default async ({ output }) => {
    await output('Opening resume...')
    window.open(`https://cdn.${DOMAIN}/${FIRST_NAME.toLowerCase()}-sapan-resume-2022.pdf`, '_blank')
}
