<template>
  <ul class="check-list">
    <li class="check-list__item" v-for="material in materials" :key="material.id">
      <label class="check-list__label" v-if="material.productsCount > 0">
        <input
          class="check-list__check sr-only"
          type="checkbox"
          name="material"
          :value="material.id"
          v-model="computedMaterials"
        />
        <span class="check-list__desc">
          {{ material.title }}
          <span>
            {{ material.productsCount }}
          </span>
        </span>
      </label>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    materials: Array,
    selectMaterialIds: Array
  },
  computed: {
    computedMaterials: {
      get() {
        return this.selectMaterialIds;
      },
      set(value) {
        this.$emit("update:selectMaterialIds", value);
      }
    }
  }
};
</script>
