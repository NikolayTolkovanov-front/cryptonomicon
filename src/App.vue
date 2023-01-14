<template>
  <div class="container mx-auto flex flex-col items-center bg-gray-100 p-4">
    <!-- load -->
    <loading-spinner />
    <!-- /load -->

    <div class="container">
      <!-- addTicker -->
      <add-ticker :tickerInTickers="tickerInTickers" @add-ticker="addTicker" />
      <!-- /addTicker -->

      <!-- tickers -->
      <tickers-list
        :ticker="ticker"
        @ticker-in-tickers="sendTickerIsInTickers"
        @select-ticker="selectTicker"
        @update-ticker="updateTicker"
      />
      <!-- /tickers -->

      <!-- graph -->
      <ticker-graph
        :selectedTicker="selectedTicker"
        :tickerPrice="tickerPrice"
      />
      <!-- /graph -->
    </div>
  </div>
</template>

<script>
import LoadingSpinner from "./components/Other/LoadingSpinner.vue"
import AddTicker from "./components/AddTickers/AddTicker.vue"
import TickersList from "./components/Tickers/TickersList.vue"
import TickerGraph from "./components/Graph/TickerGraph.vue"

export default {
  name: "App",

  components: {
    LoadingSpinner,
    AddTicker,
    TickersList,
    TickerGraph,
  },

  data() {
    return {
      ticker: [], // Значение в input
      tickerInTickers: [], // Флажок, добалена ли валюта
      selectedTicker: null,
      tickerPrice: 0,
    }
  },

  methods: {
    updateTicker(tickerPrice) {
      this.tickerPrice = tickerPrice
    },

    sendTickerIsInTickers(tickerInTickers) {
      this.ticker.shift()
      this.tickerInTickers = [...this.tickerInTickers, tickerInTickers]
    },

    addTicker(ticker) {
      this.ticker = [...this.ticker, ticker]
      this.tickerInTickers = []
    },

    selectTicker(selectedTicker) {
      this.selectedTicker = selectedTicker
    },
  },
}
</script>
