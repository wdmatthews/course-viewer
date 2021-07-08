<template>
  <v-text-field
    ref="field"
    outlined
    dense
    :label="label"
    :rules="rules"
    :value="value"
    @input="$emit('input', $event)"
  />
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
  },
  data: vm => ({
    rules: [
      v => !v || /^[0-2]{0,1}[0-9]:[0-5][0-9]$/.test(v) || 'hh:mm 24 hour format only',
    ],
  }),
  computed: {
    isValid() {
      return this.$refs.field.valid
    },
  },
}
</script>
