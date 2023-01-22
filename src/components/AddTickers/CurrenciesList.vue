<template>
  <div
    v-if="currencies.length"
    class="flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap"
  >
    <span
      v-for="currency in currencies"
      :key="currency.id"
      @click="addTicker(currency)"
      class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer"
    >
      {{ currency }}
    </span>
  </div>
</template>

<script>
import { loadCoinNamesTo } from "../../api/https.js"

export default {
  name: "CurrenciesList",

  props: {
    currency: {
      type: String,
    },

    tickerInTickers: {
      type: Array,
    },
  },

  emits: ["add-ticker", "currency-in-ticker-input"],

  data() {
    return {
      currencies: ["BTC", "USDT", "DOGE", "LTC"], // массив, в котором будут либо symbol, либо fullName
      currenciesNamesFromApi: [], // названия валют из api
    }
  },

  created() {
    loadCoinNamesTo(this.currenciesNamesFromApi)
  },

  methods: {
    addTicker(currency) {
      this.$emit("add-ticker", currency)
      this.$emit("currency-in-ticker-input", currency)
    },

    autocomplete() {
      this.currencies = []
      // Пока длина строки выбора валют меньше 4 или пока список валют не закончится
      for (
        let i = 0;
        i < this.currenciesNamesFromApi.length && this.currencies.length < 4;
        i++
      ) {
        let fullName = this.currenciesNamesFromApi[i].FullName
        let symbol = this.currenciesNamesFromApi[i].Symbol

        if (
          fullName.slice(0, this.currency.length).toUpperCase() ===
            this.currency.toUpperCase() ||
          symbol.slice(0, this.currency.length).toUpperCase() ===
            this.currency.toUpperCase()
        ) {
          this.currencies = [...this.currencies, symbol.toUpperCase()] || [
            ...this.currencies,
            fullName.toUpperCase(),
          ]
        }
      }
    },
  },

  watch: {
    currency() {
      if (this.currency === "") {
        this.currencies = []
        return
      }
      this.autocomplete()
    },

    tickerInTickers(value) {
      if (value[0] === false) {
        this.currencies = []
      }
    },
  },
}
</script>

<style></style>
