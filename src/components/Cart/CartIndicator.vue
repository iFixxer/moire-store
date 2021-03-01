<template>
  <router-link
    class="header__cart"
    href="cart.html"
    aria-label="Корзина с товарами"
    :to="{ name: 'cart' }"
  >
    <svg width="19" height="24">
      <use xlink:href="#icon-cart"></use>
    </svg>
    <span class="header__count" aria-label="Количество товаров">{{ cartProducts.length }}</span>
  </router-link>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      cartProducts: state => state.cart.cartProducts
    })
  }
};
</script>
