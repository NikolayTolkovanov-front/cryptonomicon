<template>
  <section>
    <tickers-filter
      :tickers="tickers"
      :hasNextPage="hasNextPage"
      :newPage="page"
      :newFilter="filter"
      @update-page="updatePage"
      @update-filter="updateFilter"
    />
    <!-- tickers -->
    <section>
      <template v-if="tickers.length && filteredTickers.length">
        <hr class="w-full border-t border-gray-600 my-4" />
        <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div
            v-for="t in paginatedTickers"
            @click="selectTicker(t)"
            :key="t.id"
            :class="{
              'border-4': selectedTicker === t,
            }"
            class="flex flex-col bg-white overflow-hidden shadow rounded-lg border-purple-800 border-solid cursor-pointer"
          >
            <ticker-item
              :ticker="t"
              :invalidTickers="invalidTickers"
              @remove-ticker="removeTicker"
            />
          </div>
        </dl>
        <hr class="w-full border-t border-gray-600 my-4" />
      </template>
    </section>
    <!-- /tickers -->
  </section>
</template>

<script>
import TickerItem from "./TickerItem.vue"
import {
  subscribeToTicker,
  unsubscribeFromTicker,
  subscribeToInvalidTicker,
  unsubscribeFromInvalidTicker,
} from "../../api/websocket.js"
import TickersFilter from "../Filters/TickersFilter.vue"

export default {
  name: "TickersList",

  components: {
    TickerItem,
    TickersFilter,
  },

  props: {
    ticker: {
      type: Array,
    },
  },

  emits: ["ticker-in-tickers", "update-ticker", "select-ticker"],

  data() {
    return {
      filter: "",
      tickers: [],
      invalidTickers: [],
      selectedTicker: null,
      page: 1,
    }
  },

  created() {
    // Тикеры остаются при перезагрузке страницы
    const dataTickers = localStorage.getItem("cryptonomicon-list")
    if (dataTickers) {
      this.tickers = JSON.parse(dataTickers)
      this.tickers.forEach((ticker) => {
        subscribeToTicker(ticker.name, (newPrice) => {
          this.updateTicker(ticker.name, newPrice)
        })
        subscribeToInvalidTicker(ticker.name, () => {
          this.invalidTickers.push(ticker.name)
        })
      })
    }
  },

  methods: {
    updatePage(page) {
      this.page = page
    },

    updateFilter(filter) {
      this.filter = filter
    },
    // Обновление данных
    updateTicker(tickerName, price) {
      this.tickers
        .filter((t) => t.name === tickerName)
        .forEach((t) => {
          if (t === this.selectedTicker) {
            this.$emit("update-ticker", price)
          }
          t.price = price
        })
    },
    // Добавить тикер
    addTicker(tickerName) {
      if (
        this.tickers.every((ticker) => ticker.name !== tickerName.toUpperCase())
      ) {
        const currentTicker = {
          name: tickerName.toUpperCase(),
          price: "-",
        }
        this.tickers = [...this.tickers, currentTicker]
        this.filter = ""

        subscribeToTicker(currentTicker.name, (newPrice) => {
          this.updateTicker(currentTicker.name, newPrice)
        })
        subscribeToInvalidTicker(currentTicker.name, () => {
          this.invalidTickers.push(currentTicker.name)
        })

        this.$emit("ticker-in-tickers", false)
      } else {
        this.$emit("ticker-in-tickers", true)
      }
    },

    // Удалить тикер
    removeTicker(tickerToRemove) {
      this.tickers = this.tickers.filter((ticker) => ticker !== tickerToRemove)

      if (this.selectedTicker === tickerToRemove) {
        this.selectedTicker = null
        this.$emit("ticker-in-tickers", false)
      }

      unsubscribeFromTicker(tickerToRemove.name)
      unsubscribeFromInvalidTicker(tickerToRemove.name, () => {
        this.invalidTickers = this.invalidTickers.filter(
          (ticker) => ticker !== tickerToRemove.name,
        )
      })
    },
    // Нажатие на тикер
    selectTicker(ticker) {
      this.selectedTicker = ticker
    },
  },
  computed: {
    startIndex() {
      return (this.page - 1) * 6
    },
    endIndex() {
      return this.page * 6
    },
    filteredTickers() {
      return this.tickers.filter(
        (ticker) =>
          ticker.name.slice(0, this.filter.length).toUpperCase() ===
          this.filter.toUpperCase(),
      )
    },
    paginatedTickers() {
      return this.filteredTickers.slice(this.startIndex, this.endIndex)
    },
    hasNextPage() {
      return this.filteredTickers.length > this.endIndex
    },
  },
  watch: {
    selectedTicker() {
      this.$emit("select-ticker", this.selectedTicker)
    },
    ticker(ticker) {
      this.addTicker(ticker[ticker.length - 1])
    },
    tickers() {
      localStorage.setItem("cryptonomicon-list", JSON.stringify(this.tickers))
    },
    paginatedTickers() {
      if (this.paginatedTickers.length === 0 && this.page > 1) {
        this.page -= 1
      }
    },
    filter() {
      this.page = 1
    },
  },
}
</script>

<style></style>
