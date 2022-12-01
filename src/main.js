import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import './assets/base.css';
import { defineCustomElements } from 'skateui/loader';

import { Skapi } from "skapi-js";

defineCustomElements(window);
const app = createApp(App);

app.use(router);

app.mount('#app');

export const skapi = new Skapi('ap22lazr5d2xrzhl6s77ea', '7aa4ffe1-1b06-4375-9be2-47d89da9d206');
