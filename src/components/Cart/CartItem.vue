<template>
  <li class="cart__item product">
    <div class="product__pic">
      <img
        :src="item.color.gallery ? item.color.gallery[0].file.url : noPhoto"
        width="120"
        height="120"
        :alt="item.product.title"
      />
    </div>
    <h3 class="product__title">{{ item.product.title }}</h3>
    <p class="product__info product__info--color">
      Цвет:
      <span style="padding-right: 10px">
        <i :style="{ 'background-color': item.color.color.code }"></i>
        <br />
      </span>
      Размер:
      <span style="padding-left: 10px">
        {{ item.size.title }}
      </span>
    </p>

    <span class="product__code"> Артикул: {{ item.product.id }} </span>

    <ProductQuantityButtons :quantity.sync="quantity" />

    <b class="product__price"> {{ (item.quantity * item.product.price) | numberFormat }} ₽ </b>

    <button
      class="product__del button-del"
      type="button"
      aria-label="Удалить товар из корзины"
      @click.prevent="deleteProduct"
    >
      <svg width="20" height="20" fill="currentColor">
        <use xlink:href="#icon-close"></use>
      </svg>
    </button>
  </li>
</template>

<script>
import ProductQuantityButtons from '@/components/Product/ProductQuantityButtons.vue';
import noPhoto from '@/assets/img/noPhoto.jpg';
import numberFormat from '@/helpers/numberFormat';
import { mapActions } from 'vuex';

export default {
  components: { ProductQuantityButtons },
  filters: { numberFormat },
  props: {
    item: Object,
  },
  data() {
    return {
      noPhoto,
    };
  },
  computed: {
    quantity: {
      get() {
        return this.item.quantity;
      },
      set(value) {
        this.$store.dispatch('cart/updateCartProductQuantity', {
          basketItemId: this.item.basketItemId,
          quantity: value,
        });
      },
    },
  },
  watch: {
    quantity: {
      handler() {
        if (this.quantity === 0) this.deleteProduct();
      },
    },
  },
  methods: {
    ...mapActions('cart', ['deleteCartProduct']),

    deleteProduct() {
      this.deleteCartProduct({ basketItemId: this.item.basketItemId });
    },
  },
};
</script>
