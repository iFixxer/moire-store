<template>
  <ul class="cart__options options">
    <li class="options__item" v-for="payment in paymentTypes" :key="payment.id">
      <label class="options__label">
        <input
          class="options__radio sr-only"
          type="radio"
          name="payment"
          :value="payment"
          v-model="computedPaymentTypeId"
        />
        <span
          class="options__value"
          :class="{
            options__select: paymentTypeId === payment.id,
            options__hover: paymentTypeId != payment.id
          }"
        >
          {{ payment.title }}
        </span>
      </label>
    </li>
  </ul>
</template>

<script>
export default {
  props: ["paymentTypes", "paymentTypeId"],
  computed: {
    computedPaymentTypeId: {
      get() {
        return this.$emit("update:paymentTypeId", this.paymentTypes[0].id);
      },
      set(payment) {
        this.$emit("update:paymentTypeId", payment.id);
      }
    }
  }
};
</script>
