<template>
  <ul class="colors colors--black">
    <li class="colors__item" v-for="color in colors" :key="color.id">
      <label class="colors__label" v-if="color.code !== null">
        <input
          class="colors__radio sr-only"
          type="checkbox"
          name="color"
          :value="color.id"
          v-model="computedColors"
        />
        <span class="colors__value" :style="{ 'background-color': color.code }"> </span>
      </label>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    colors: Array,
    selectColorIds: Array,
  },
  computed: {
    computedColors: {
      get() {
        return this.selectColorIds;
      },
      set(value) {
        this.$emit('update:selectColorIds', value);
      },
    },
  },
};
</script>
