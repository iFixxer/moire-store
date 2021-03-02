<template>
  <ul class="check-list">
    <li class="check-list__item" v-for="season in seasons" :key="season.id">
      <label class="check-list__label" v-if="season.productsCount > 0">
        <input
          class="check-list__check sr-only"
          type="checkbox"
          name="collection"
          :value="season.id"
          v-model="computedSeasons"
        />
        <span class="check-list__desc">
          {{ season.title }}
          <span>
            {{ season.productsCount }}
          </span>
        </span>
      </label>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    seasons: Array,
    selectSeasonIds: Array
  },
  computed: {
    computedSeasons: {
      get() {
        return this.selectSeasonIds;
      },
      set(value) {
        this.$emit("update:selectSeasonIds", value);
      }
    }
  }
};
</script>
