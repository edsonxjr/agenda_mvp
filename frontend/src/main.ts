import { createApp } from 'vue'
import App from './App.vue'
import router from './router'


import { vMaska } from "maska/vue" 

const app = createApp(App)

app.directive("maska", vMaska) 

app.use(router)
app.mount('#app')