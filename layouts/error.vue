<template>
  <p class="ma-4 text-center">
    Error {{ error.statusCode }}
  </p>
</template>

<script>
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  head: vm => ({
    title: `Error ${vm.error.statusCode} | Course Viewer`,
  }),
}
</script>
