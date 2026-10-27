import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/home/HomePage.vue';
import LoginPage from '../pages/login/LoginPage.vue';
import SchedulePage from '../pages/schedule/SchedulePage.vue';
import ProfilePage from '../pages/profile/ProfilePage.vue';
import CreateHuddlePage from '../pages/create-huddle/CreateHuddlePage.vue';
import HuddlePage from '../pages/huddle/HuddlePage.vue';

const routes = [
    { path: '/', name: 'Home', component: HomePage },
    { path: '/login', name: 'Login', component: LoginPage },
    { path: '/schedule', name: 'Schedule', component: SchedulePage },
    { path: '/profile', name: 'Profile', component: ProfilePage, props: true },
    { path: '/create-huddle', name: 'CreateHuddle', component: CreateHuddlePage, props: true },
    { path: '/huddle', name: 'Huddle', component: HuddlePage, props: true }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
