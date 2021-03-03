import Vue from 'vue';
import VueRouter from 'vue-router';
import CatalogPage from '@/pages/CatalogPage.vue';
import ProductPage from '@/pages/ProductPage.vue';
import CartPage from '@/pages/CartPage.vue';
import OrderPage from '@/pages/OrderPage.vue';
import OrderInfoPage from '@/pages/OrderInfoPage.vue';
import NotFoundPage from '@/pages/NotFoundPage.vue';

Vue.use(VueRouter);

const router = new VueRouter({
  routes: [
    { name: 'catalog', component: CatalogPage, path: '/' },
    { name: 'product', component: ProductPage, path: '/product/:id' },
    { name: 'cart', component: CartPage, path: '/cart' },
    { name: 'order', component: OrderPage, path: '/orders' },
    { name: 'orderInfo', component: OrderInfoPage, path: '/orders/:id' },
    { name: 'notFound', component: NotFoundPage, path: '*' },
  ],
});

router.beforeResolve((to, from, next) => {
  if (to.name) {
    NProgress.start();
  }
  next();
});

router.afterEach((to, from) => {
  NProgress.done();
});

export default router;
