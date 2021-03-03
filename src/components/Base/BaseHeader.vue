<template>
  <header class="header container">
    <div class="header__wrapper">
      <span class="header__info">Каталог</span>

      <router-link class="header__logo" :to="{ name: 'catalog' }">
        <img
          src="img/svg/logo-moire.svg"
          alt="Логотип интернет магазина Moire"
          width="116"
          height="34"
        />
      </router-link>

      <a class="header__tel" href="tel:8 800 600 90 09">
        8 800 600 90 09
      </a>

      <CartIndicator />
    </div>
  </header>
</template>

<script>
import CartIndicator from '@/components/Cart/CartIndicator.vue';

export default {
  components: { CartIndicator },
};
</script>

<style></style>
