<template>
  <ul class="check-list">
    <li class="check-list__item" v-for="item in items" :key="item.id">
      <label class="check-list__label" v-if="item.productsCount > 0">
        <input
          class="check-list__check sr-only"
          type="checkbox"
          :value="item.id"
          v-model="computedItems"
        />
        <span class="check-list__desc">
          {{ item.title }}
          <span>
            {{ item.productsCount }}
          </span>
        </span>
      </label>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    items: Array,
    selectIds: Array,
  },
  computed: {
    computedItems: {
      get() {
        return this.selectIds;
      },
      set(value) {
        this.$emit('update:selectIds', value);
      },
    },
  },
};
</script>
