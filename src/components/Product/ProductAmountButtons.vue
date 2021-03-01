<template>
  <div class="form__counter">
    <button type="button" aria-label="Убрать один товар" @click.prevent="oneLess">
      <svg width="12" height="12" fill="currentColor">
        <use xlink:href="#icon-minus"></use>
      </svg>
    </button>

    <input type="text" v-model="computedAmount" />

    <button type="button" aria-label="Добавить один товар" @click.prevent="oneMore">
      <svg width="12" height="12" fill="currentColor">
        <use xlink:href="#icon-plus"></use>
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  props: ["amount"],
  computed: {
    computedAmount: {
      get() {
        return this.amount;
      },
      set(value) {
        this.$emit("update:amount", value);
      }
    }
  },
  methods: {
    oneLess() {
      if (this.computedAmount > 1) {
        return --this.computedAmount;
      }
    },
    oneMore() {
      return ++this.computedAmount;
    }
  }
};
</script>
