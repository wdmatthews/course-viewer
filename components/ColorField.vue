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
        value: '#D32F2F',
      },
      {
        text: 'Pink',
        value: '#D81B60',
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
        value: '#1976D2',
      },
      {
        text: 'Light Blue',
        value: '#0277BD',
      },
      {
        text: 'Cyan',
        value: '#00838F',
      },
      {
        text: 'Teal',
        value: '#00796B',
      },
      {
        text: 'Green',
        value: '#2E7D32',
      },
      {
        text: 'Light Green',
        value: '#689F38',
      },
      {
        text: 'Lime',
        value: '#9E9D24',
      },
      {
        text: 'Yellow',
        value: '#F9A825',
      },
      {
        text: 'Amber',
        value: '#FF8F00',
      },
      {
        text: 'Orange',
        value: '#EF6C00',
      },
      {
        text: 'Deep Orange',
        value: '#F4511E',
      },
      {
        text: 'Brown',
        value: '#795548',
      },
    ],
  }),
}
</script>
