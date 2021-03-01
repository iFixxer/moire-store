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

    <ProductAmountButtons :amount.sync="amount"></ProductAmountButtons>

    <b class="product__price"> {{ (item.amount * item.product.price) | numberFormat }} ₽ </b>

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
import noPhoto from "@/assets/img/noPhoto.jpg";
import numberFormat from "@/helpers/numberFormat";
import { mapActions } from "vuex";
import ProductAmountButtons from "@/components/Product/ProductAmountButtons";

export default {
  data() {
    return {
      noPhoto: noPhoto
    };
  },
  filters: { numberFormat },
  props: ["item"],
  components: { ProductAmountButtons },
  computed: {
    amount: {
      get() {
        return this.item.amount;
      },
      set(value) {
        this.$store.dispatch("updateCartProductAmount", {
          basketItemId: this.item.basketItemId,
          amount: value
        });
      }
    }
  },
  methods: {
    ...mapActions(["deleteCartProduct"]),

    deleteProduct() {
      this.deleteCartProduct({ basketItemId: this.item.basketItemId });
    }
  }
};
</script>
