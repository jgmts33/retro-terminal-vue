import { createApp } from 'vue'

import App from '@/components/App.vue'
import store from '@/store'
import { installRadio } from '@/util/radio'

const app = createApp(App)

installRadio(app)

app.use(store)

app.mount('#app')
