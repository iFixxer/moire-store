import Vue from 'vue';
import Vuex from 'vuex';
import products from '@/store/modules/products';
import cart from '@/store/modules/cart';
import order from '@/store/modules/order';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    products,
    cart,
    order,
  },
});
