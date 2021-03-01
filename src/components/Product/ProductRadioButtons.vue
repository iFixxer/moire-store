<template>
  <ul class="colors colors--black">
    <li class="colors__item" v-for="color in colors" :key="color.id">
      <label class="colors__label" v-if="color.color.code != null">
        <input
          class="colors__radio sr-only"
          type="radio"
          name="color"
          :value="color"
          v-model="computedColor"
        />
        <span
          v-if="color.color != null"
          class="colors__value"
          :class="{
            colors__val: computedColor === color.color
          }"
          :style="{ 'background-color': color.color.code }"
        >
        </span>
      </label>
    </li>
  </ul>
</template>

<script>
export default {
  props: ["colors", "currentColorId"],
  computed: {
    computedColor: {
      get() {
        return this.currentColorId;
      },
      set(color) {
        this.$emit("update:currentColorId", color);
      }
    }
  }
};
</script>

<style>
.colors__val::before {
  border-color: var(--border-color);
}
</style>
