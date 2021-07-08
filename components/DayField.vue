<template>
  <v-select
    label="Day"
    outlined
    hide-details
    dense
    item-text="text"
    item-value="value"
    :items="options"
    :disabled="disabled"
    :value="value"
    @input="$emit('input', $event)"
  />
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Number],
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data: vm => ({
    options: [
      {
        text: 'Sunday',
        value: 0,
      },
      {
        text: 'Monday',
        value: 1,
      },
      {
        text: 'Tuesday',
        value: 2,
      },
      {
        text: 'Wednesday',
        value: 3,
      },
      {
        text: 'Thursday',
        value: 4,
      },
      {
        text: 'Friday',
        value: 5,
      },
      {
        text: 'Saturday',
        value: 6,
      },
    ],
  }),
}
</script>
