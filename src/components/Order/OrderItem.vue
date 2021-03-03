<template>
  <li class="cart__order">
    <h3>{{ item.product.title }} {{ quantity }}</h3>
    <b>{{ (item.quantity * item.product.price) | numberFormat }} ₽</b>
    <p class="product__info product__info--color">Размер: {{ item.size.title }}</p>
    <p class="product__info product__info--color">
      Цвет:
      <span style="padding-right: 10px">
        <i :style="{ 'background-color': item.color.color.code }"></i>
        <br />
      </span>
    </p>
    <span>Артикул: {{ item.product.id }}</span>
  </li>
</template>

<script>
import numberFormat from '@/helpers/numberFormat';

export default {
  filters: { numberFormat },
  props: {
    item: Object,
  },
  computed: {
    quantity() {
      if (this.item.quantity > 1) {
        return `( ${this.item.quantity} шт.)`;
      }
      return 0;
    },
  },
};
</script>
