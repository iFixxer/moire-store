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

    <ProductRadioButtons :colors="product.colors" :currentColorId.sync="currentColorId">
    </ProductRadioButtons>
  </li>
</template>

<script>
import ProductRadioButtons from "@/components/Product/ProductRadioButtons";
import numberFormat from "@/helpers/numberFormat";
import noPhoto from "@/assets/img/noPhoto.jpg";

export default {
  data() {
    return {
      currentColorId: this.product.colors[0].color.id,
      currentImage: this.product.colors[0].gallery
        ? this.product.colors[0].gallery[0].file.url
        : noPhoto
    };
  },
  components: { ProductRadioButtons },
  props: ["product"],
  filters: {
    numberFormat
  },
  watch: {
    currentColorId: {
      handler(value) {
        this.currentImage = value.gallery ? value.gallery[0].file.url : noPhoto;
      }
    }
  }
};
</script>
