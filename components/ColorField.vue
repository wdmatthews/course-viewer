<template>
  <v-select
    label="Color"
    outlined
    dense
    item-text="text"
    item-value="value"
    :items="colors"
    :disabled="disabled"
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
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data: vm => ({
    colors: [
      {
        text: 'Red',
        value: '#F44336',
      },
      {
        text: 'Pink',
        value: '#E91E63',
      },
      {
        text: 'Purple',
        value: '#9C27B0',
      },
      {
        text: 'Deep Purple',
        value: '#673AB7',
      },
      {
        text: 'Indigo',
        value: '#3F51B5',
      },
      {
        text: 'Blue',
        value: '#2196F3',
      },
      {
        text: 'Light Blue',
        value: '#03A9F4',
      },
      {
        text: 'Cyan',
        value: '#00BCD4',
      },
      {
        text: 'Teal',
        value: '#009688',
      },
      {
        text: 'Green',
        value: '#4CAF50',
      },
      {
        text: 'Light Green',
        value: '#8BC34A',
      },
      {
        text: 'Lime',
        value: '#C0CA33',
      },
      {
        text: 'Yellow',
        value: '#FBC02D',
      },
      {
        text: 'Amber',
        value: '#FFB300',
      },
      {
        text: 'Orange',
        value: '#FF9800',
      },
      {
        text: 'Deep Orange',
        value: '#FF5722',
      },
      {
        text: 'Brown',
        value: '#795548',
      },
    ],
  }),
}
</script>
