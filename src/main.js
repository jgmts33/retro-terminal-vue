import { createApp } from 'vue'

import App from '@/components/App.vue'
import { installRadio } from '@/util/radio'

const app = createApp(App)
installRadio(app)
app.mount('#app')
