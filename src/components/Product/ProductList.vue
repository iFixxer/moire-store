<template>
  <ul class="catalog__list">
    <ProductListItem v-for="product in products" :key="product.id" :product="product">
    </ProductListItem>
  </ul>
</template>

<script>
import ProductListItem from "@/components/Product/ProductListItem";

export default {
  components: { ProductListItem },
  props: {
    products: Array
  }
};
</script>
