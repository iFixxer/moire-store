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
          class="colors__val"
          :class="{
            colors__select: computedColor === color.color,
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
  props: {
    colors: Array,
    currentColor: Object,
  },
  computed: {
    computedColor: {
      get() {
        return this.currentColor;
      },
      set(color) {
        this.$emit('update:currentColor', color);
      },
    },
  },
};
</script>

<style>
/* Classes for current color */
.colors__val,
.colors__val::before {
  border-radius: 50%;
  -webkit-transition: all 0.2s ease;
  transition: all 0.2s ease;
}
.colors__val {
  display: block;
  width: 20px;
  height: 20px;
}
.colors__val::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  width: 26px;
  height: 26px;
  border: 1px solid transparent;
}
.colors__label:focus .colors__val::before,
.colors__label:hover .colors__val::before {
  border-color: var(--border-color);
}
.colors__radio:focus ~ .colors__val::before {
  opacity: 0.7;
}
.colors__select::before {
  border-color: var(--border-color);
}
</style>
