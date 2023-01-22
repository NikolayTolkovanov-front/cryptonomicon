<template>
  <section>
    <label for="wallet" class="block text-sm font-medium text-gray-700">
      {{ ticker }}
    </label>
    <div class="mt-1 relative rounded-md shadow-md">
      <input
        v-model="ticker"
        @keydown.enter="addTicker()"
        type="text"
        name="wallet"
        id="wallet"
        class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
        placeholder="Например DOGE"
        autocomplete="off"
      />
    </div>
  </section>
</template>

<script>
export default {
  name: "TickerInput",

  props: {
    tickerInTickers: {
      type: Array,
    },

    currencyFromCurrenciesList: {
      type: String,
    },
  },

  emits: ["add-ticker", "autocomplete", "input-changed"],

  data() {
    return {
      ticker: "",
      currency: this.currencyFromCurrenciesList,
    }
  },

  methods: {
    addTicker() {
      this.$emit("add-ticker", this.ticker)
    },

    autocomplete() {
      this.$emit("autocomplete", this.ticker)
    },
  },

  watch: {
    currencyFromCurrenciesList(value) {
      this.ticker = value
    },

    ticker(value) {
      this.$emit("input-changed", value)
      this.$emit("autocomplete", value)
    },

    tickerInTickers(value) {
      if (value[0] === false) {
        this.ticker = ""
      }
    },
  },
}
</script>

<style></style>
