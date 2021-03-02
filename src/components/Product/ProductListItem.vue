<template>
  <li class="catalog__item">
    <router-link class="catalog__pic" :to="{ name: 'product', params: { id: product.id } }">
      <img :src="currentImage" :alt="currentImage" />
    </router-link>

    <h3 class="catalog__title">
      <a href="#">
        {{ product.title }}
      </a>
    </h3>

    <span class="catalog__price"> {{ product.price | numberFormat }}₽ </span>

    <ProductRadioButtons :colors="product.colors" :currentColor.sync="currentColor">
    </ProductRadioButtons>
  </li>
</template>

<script>
import ProductRadioButtons from "@/components/Product/ProductRadioButtons";
import noPhoto from "@/assets/img/noPhoto.jpg";
import numberFormat from "@/helpers/numberFormat";

export default {
  components: { ProductRadioButtons },
  filters: {
    numberFormat
  },
  props: {
    product: Object
  },
  data() {
    return {
      currentColor: this.product.colors[0].color,
      currentImage: this.product.colors[0].gallery
        ? this.product.colors[0].gallery[0].file.url
        : noPhoto
    };
  },
  watch: {
    currentColor: {
      handler(value) {
        this.currentImage = value.gallery ? value.gallery[0].file.url : noPhoto;
      }
    }
  }
};
</script>
