import store from '@/store'

export default async ({ output }) => {
    store.commit('toggleGlitching')
    await output(store.state.glitching ? '0x39FC2 0x39FDD' : 'Normality restored.')
}
