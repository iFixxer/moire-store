<template>
  <div class="form__counter">
    <button type="button" aria-label="Убрать один товар" @click.prevent="computedQuantity--">
      <svg width="12" height="12" fill="currentColor">
        <use xlink:href="#icon-minus"></use>
      </svg>
    </button>

    <input type="number" v-model="computedQuantity" />

    <button type="button" aria-label="Добавить один товар" @click.prevent="computedQuantity++">
      <svg width="12" height="12" fill="currentColor">
        <use xlink:href="#icon-plus"></use>
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  props: {
    quantity: Number,
  },
  computed: {
    computedQuantity: {
      get() {
        return this.quantity;
      },
      set(value) {
        this.$emit('update:quantity', Number(value));
      },
    },
  },
};
</script>

<style>
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
