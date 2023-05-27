import { createApp, ref } from 'vue';
import App from './App.vue';
import router from './router';
import './assets/base.less';
// import { Skapi } from "skapi-js";

const app = createApp(App);

app.use(router);

app.mount('#app');

// export const skapi = new Skapi('ap22TP6OQRDgenwunsVi', '7aa4ffe1-1b06-4375-9be2-47d89da9d206');
export const user = ref(null);