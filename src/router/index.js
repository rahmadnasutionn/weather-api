import { createRouter, createWebHistory } from 'vue-router'

const HomeView = () =>
    import ('../views/HomeView.vue');

const CityView = () =>
    import ('../views/CityView.vue');

const routes = [{
        path: '/',
        name: 'home',
        component: HomeView,
        meta: {
            title: 'Home'
        }
    },
    {
        path: '/weather/:state/:city',
        name: 'cityView',
        component: CityView,
        meta: {
            title: 'Weather Page'
        }
    }

];

const router = createRouter({
    history: createWebHistory(
        import.meta.env.BASE_URL),
    routes
});

router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | The Local Weather`
    next();
});

export default router