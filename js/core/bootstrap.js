import { createApp } from 'vue';
import { getTheme } from './utils.js';
import router from './router.js';
import '../../scss/app.scss';

/**
 * Bootstrap the single-page Vue app into #app.
 * @param {object} App - The root Vue component (should contain <router-view>).
 */
export function mount(App) {
    document.documentElement.setAttribute('data-bs-theme', getTheme()); //I'M SORRY TYLER PLEASE DON'T HURT ME!!!
    createApp(App).use(router).mount('#app');
}

export { router };
