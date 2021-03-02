<template>
  <ul class="cart__options options">
    <li class="options__item" v-for="delivery in deliveryTypes" :key="delivery.id">
      <label class="options__label">
        <input
          class="options__radio sr-only"
          type="radio"
          name="delivery"
          :value="delivery"
          v-model="computedDeliveryTypeId"
        />
        <span
          class="options__value"
          :class="{
            options__select: computedDeliveryTypeId === delivery.id,
            options__hover: computedDeliveryTypeId != delivery.id
          }"
        >
          {{ delivery.title }} <b>{{ delivery.price }} ₽</b>
        </span>
      </label>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    deliveryTypes: Array,
    deliveryTypeId: Number,
    deliveryPrice: String
  },
  computed: {
    computedDeliveryTypeId: {
      get() {
        return this.deliveryTypeId;
      },
      set(delivery) {
        this.$emit("update:deliveryTypeId", delivery.id);
        this.$emit("update:deliveryPrice", delivery.price);
      }
    }
  }
};
</script>
