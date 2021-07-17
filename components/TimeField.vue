<template>
  <v-text-field
    ref="field"
    outlined
    dense
    placeholder="24 hour format"
    :label="label"
    :suffix="amPmTime"
    :rules="rules"
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
    label: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
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
    amPmTime() {
      const [hours, minutes] = this.value.split(':')
      if (hours && minutes && !isNaN(hours) && !isNaN(minutes)) {
        let hoursInt = parseInt(hours)
        const minutesInt = parseInt(minutes)
        const isAM = hoursInt < 12
        if (hoursInt === 0) { hoursInt = 12 }
        if (hoursInt > 12) { hoursInt -= 12 }
        return `${hoursInt.toString().padStart(2, '0')}:${minutesInt.toString().padStart(2, '0')} ${isAM ? 'AM' : 'PM'}`
      }
      return ''
    },
  },
}
</script>
