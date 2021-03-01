<template>
  <ul class="catalog__list">
    <ProductItem v-for="product in products" :key="product.id" :product="product"> </ProductItem>
  </ul>
</template>

<script>
import ProductItem from "@/components/Product/ProductItem";

export default {
  components: { ProductItem },
  props: ["products"]
};
</script>
