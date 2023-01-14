<template>
  <div
    v-if="tickerInTickers[tickerInTickers.length - 1]"
    class="text-sm text-red-600"
  >
    {{ message }}
  </div>
</template>

<script>
export default {
  name: "ErrorMessage",

  props: {
    tickerInTickers: {
      type: Array,
    },

    inputChanged: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      message: "Такой тикер уже добавлен",
    }
  },

  watch: {
    tickerInTickers() {
      this.message = "Такой тикер уже добавлен"
    },

    inputChanged() {
      this.message = ""
    },
  },
}
</script>

<style></style>
