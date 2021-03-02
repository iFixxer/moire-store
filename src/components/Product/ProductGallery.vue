<template>
  <ul class="pics__list">
    <li class="pics__item" v-for="image in images" :key="image.name">
      <a href="#" @click.prevent="selectImage(image)">
        <img
          width="98"
          height="98"
          :src="image.gallery ? image.gallery[0].file.url : noPhoto"
          :alt="image.gallery ? image.gallery[0].file.url : noPhoto"
          :class="{
            'pics__link pics__link--current':
              currentImage === (image.gallery ? image.gallery[0].file.url : noPhoto)
          }"
        />
      </a>
    </li>
  </ul>
</template>

<script>
import noPhoto from "@/assets/img/noPhoto.jpg";

export default {
  props: {
    images: Array,
    currentImage: String
  },
  data() {
    return {
      noPhoto: noPhoto
    };
  },
  methods: {
    selectImage(value) {
      this.$emit("update:currentImage", value);
    }
  }
};
</script>

<style></style>
