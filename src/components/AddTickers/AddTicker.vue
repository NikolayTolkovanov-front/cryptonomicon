<template>
  <section>
    <div class="flex">
      <div class="max-w-xs">
        <!-- tickerInput -->
        <ticker-input
          :ticker="ticker"
          :tickerInTickers="tickerInTickers"
          :currencyFromCurrenciesList="currencyFromCurrenciesList"
          @add-ticker="addTicker"
          @autocomplete="autocomplete"
          @input-changed="changeInput"
        />
        <!-- tickerInput -->

        <!-- currencies -->
        <currencies-list
          :tickerInTickers="tickerInTickers"
          :currency="currency"
          @add-ticker="addTicker"
          @currency-in-ticker-input="setCurrencyInTickerInput"
        />
        <!-- /currencies -->

        <!-- errorMessage -->
        <error-message
          :tickerInTickers="tickerInTickers"
          :inputChanged="tickerFromInput"
        />
        <!-- /errorMessage -->
      </div>
    </div>
    <!-- addTickerButton -->
    <add-ticker-button :ticker="tickerFromInput" @add-ticker="addTicker" />
    <!-- /addTickerButton -->
  </section>
</template>

<script>
import AddTickerButton from "./AddTickerButton.vue"
import CurrenciesList from "./CurrenciesList.vue"
import ErrorMessage from "./ErrorMessage.vue"
import TickerInput from "./TickerInput.vue"
export default {
  name: "AddTicker",
  components: {
    CurrenciesList,
    ErrorMessage,
    TickerInput,
    AddTickerButton,
  },

  props: {
    tickerInTickers: {
      type: Array,
    },
  },

  emits: ["add-ticker"],

  data() {
    return {
      ticker: "",
      currency: "",
      tickerFromInput: "",
      currencyFromCurrenciesList: "",
    }
  },

  methods: {
    setCurrencyInTickerInput(currency) {
      this.currencyFromCurrenciesList = currency
    },

    changeInput(inputValue) {
      this.tickerFromInput = inputValue
    },

    addTicker(ticker) {
      if (ticker !== "") {
        this.ticker = ticker
        this.$emit("add-ticker", ticker)
      }
    },

    autocomplete(currency) {
      this.currency = currency
    },
  },
}
</script>

<style></style>
