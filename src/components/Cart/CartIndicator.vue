<template>
  <router-link
    v-if="cartLoad"
    class="header__cart"
    href="cart.html"
    aria-label="Корзина с товарами"
    :to="{ name: 'cart' }"
  >
    <svg width="19" height="24">
      <use xlink:href="#icon-cart"></use>
    </svg>
    <span class="header__count" aria-label="Количество товаров">{{
      $store.state.cartProducts.length
    }}</span>
  </router-link>
  <span v-else class="header__tel">Загрузка...</span>
</template>

<script>
export default {
  data() {
    return {
      cartLoad: false
    };
  },
  created() {
    this.cartLoad = true;
  }
};
</script>
