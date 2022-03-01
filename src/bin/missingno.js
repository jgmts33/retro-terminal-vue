import sleep from 'sleep-promise'
import store from '@/store'

export default async ({ output, confirm }) => {
    await output('Wild MISSINGNO. appeared!', { speak: 'Wild missing no appeared!' })
    if (await confirm('Throw a poké ball at it?')) {
        await output('You used poké ball!')
        await output('...')
        await output('...')
        await output('...')
        await sleep(2)
        store.commit('toggleGlitching')
        await output('Hooray, MISSINGNO. was caught!', { speak: 'Hooray, missing no was caught!', delay: 0 })
    } else {
        await output("That's probably for the best.")
        await output('The wild MISSINGNO. fled.', { speak: 'The wild missing no fled.' })
    }
}
