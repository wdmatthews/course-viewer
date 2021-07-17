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
        text: 'Red 1',
        value: '#F44336',
      },
      {
        text: 'Red 2',
        value: '#E53935',
      },
      {
        text: 'Red 3',
        value: '#D32F2F',
      },
      {
        text: 'Red 4',
        value: '#C62828',
      },
      {
        text: 'Pink 1',
        value: '#E91E63',
      },
      {
        text: 'Pink 2',
        value: '#D81B60',
      },
      {
        text: 'Pink 3',
        value: '#C2185B',
      },
      {
        text: 'Pink 4',
        value: '#AD1457',
      },
      {
        text: 'Purple 1',
        value: '#9C27B0',
      },
      {
        text: 'Purple 2',
        value: '#8E24AA',
      },
      {
        text: 'Purple 3',
        value: '#7B1FA2',
      },
      {
        text: 'Purple 4',
        value: '#6A1B9A',
      },
      {
        text: 'Deep Purple 1',
        value: '#673AB7',
      },
      {
        text: 'Deep Purple 2',
        value: '#5E35B1',
      },
      {
        text: 'Deep Purple 3',
        value: '#512DA8',
      },
      {
        text: 'Deep Purple 4',
        value: '#4527A0',
      },
      {
        text: 'Indigo 1',
        value: '#3F51B5',
      },
      {
        text: 'Indigo 2',
        value: '#3949AB',
      },
      {
        text: 'Indigo 3',
        value: '#303F9F',
      },
      {
        text: 'Indigo 4',
        value: '#283593',
      },
      {
        text: 'Blue 1',
        value: '#2196F3',
      },
      {
        text: 'Blue 2',
        value: '#1E88E5',
      },
      {
        text: 'Blue 3',
        value: '#1976D2',
      },
      {
        text: 'Blue 4',
        value: '#1565C0',
      },
      {
        text: 'Light Blue 1',
        value: '#03A9F4',
      },
      {
        text: 'Light Blue 2',
        value: '#039BE5',
      },
      {
        text: 'Light Blue 3',
        value: '#0288D1',
      },
      {
        text: 'Light Blue 4',
        value: '#0277BD',
      },
      {
        text: 'Cyan 1',
        value: '#00BCD4',
      },
      {
        text: 'Cyan 2',
        value: '#00ACC1',
      },
      {
        text: 'Cyan 3',
        value: '#0097A7',
      },
      {
        text: 'Cyan 4',
        value: '#00838F',
      },
      {
        text: 'Teal 1',
        value: '#009688',
      },
      {
        text: 'Teal 2',
        value: '#00897B',
      },
      {
        text: 'Teal 3',
        value: '#00796B',
      },
      {
        text: 'Teal 4',
        value: '#00695C',
      },
      {
        text: 'Green 1',
        value: '#4CAF50',
      },
      {
        text: 'Green 2',
        value: '#43A047',
      },
      {
        text: 'Green 3',
        value: '#388E3C',
      },
      {
        text: 'Green 4',
        value: '#2E7D32',
      },
      {
        text: 'Light Green 1',
        value: '#8BC34A',
      },
      {
        text: 'Light Green 2',
        value: '#7CB342',
      },
      {
        text: 'Light Green 3',
        value: '#689F38',
      },
      {
        text: 'Light Green 4',
        value: '#558B2F',
      },
      {
        text: 'Lime 1',
        value: '#CDDC39',
      },
      {
        text: 'Lime 2',
        value: '#C0CA33',
      },
      {
        text: 'Lime 3',
        value: '#AFB42B',
      },
      {
        text: 'Lime 4',
        value: '#9E9D24',
      },
      {
        text: 'Yellow 1',
        value: '#FFEB3B',
      },
      {
        text: 'Yellow 2',
        value: '#FDD835',
      },
      {
        text: 'Yellow 3',
        value: '#FBC02D',
      },
      {
        text: 'Yellow 4',
        value: '#F9A825',
      },
      {
        text: 'Amber 1',
        value: '#FFC107',
      },
      {
        text: 'Amber 2',
        value: '#FFB300',
      },
      {
        text: 'Amber 3',
        value: '#FFA000',
      },
      {
        text: 'Amber 4',
        value: '#FF8F00',
      },
      {
        text: 'Orange 1',
        value: '#FF9800',
      },
      {
        text: 'Orange 2',
        value: '#FB8C00',
      },
      {
        text: 'Orange 3',
        value: '#F57C00',
      },
      {
        text: 'Orange 4',
        value: '#EF6C00',
      },
      {
        text: 'Deep Orange 1',
        value: '#FF5722',
      },
      {
        text: 'Deep Orange 2',
        value: '#F4511E',
      },
      {
        text: 'Deep Orange 3',
        value: '#E64A19',
      },
      {
        text: 'Deep Orange 4',
        value: '#D84315',
      },
      {
        text: 'Brown 1',
        value: '#795548',
      },
      {
        text: 'Brown 2',
        value: '#6D4C41',
      },
      {
        text: 'Brown 3',
        value: '#5D4037',
      },
      {
        text: 'Brown 4',
        value: '#4E342E',
      },
    ],
  }),
}
</script>
