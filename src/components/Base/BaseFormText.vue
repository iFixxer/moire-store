<template>
  <BaseFormField :title="title" :error="error">
    <input
      v-model="dataValue"
      class="form__input"
      :type="type"
      :id="id"
      :placeholder="placeholder"
      :maxlength="maxlength"
      :v-mask="mask"
    />
  </BaseFormField>
</template>

<script>
import formFieldMixin from "@/mixins/formFieldMixin";

export default {
  props: {
    type: String,
    id: String,
    maxlength: String,
    mask: String
  },
  mixins: [formFieldMixin]
};
</script>
