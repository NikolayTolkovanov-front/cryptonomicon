<template>
  <section>
    <!-- filter -->
    <p class="block text-sm font-medium text-gray-700">
      Фильтр:
      <input
        v-model="filter"
        class="block w-100 pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
        type="text"
      />
    </p>
    <!-- /filter -->
    <!-- pagination -->
    <button
      v-if="page > 1"
      @click="page = page - 1"
      class="my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mr-5"
    >
      Назад
    </button>
    <button
      v-if="hasNextPage"
      @click="page = page + 1"
      class="my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mr-5"
    >
      Вперед
    </button>
    <p v-if="tickers.length" class="block text-md font-medium text-gray-700">
      {{ page }} страница
    </p>
    <!-- /pagination -->
  </section>
</template>

<script>
export default {
  name: "TickersFilter",

  props: {
    tickers: {
      type: Array,
    },

    hasNextPage: {
      type: Boolean,
    },

    newPage: {
      type: Number,
    },

    newFilter: {
      type: String,
    },
  },

  emits: ["update-page", "update-filter"],

  data() {
    return {
      filter: "",
      page: 1,
    }
  },

  created() {
    const windowData = Object.fromEntries(
      new URL(window.location).searchParams.entries(),
    )
    const VALID_KEYS = ["filter", "page"]
    VALID_KEYS.forEach((key) => {
      if (windowData[key]) {
        this[key] = windowData[key]
        if (key === "page") {
          this[key] = Number(windowData[key])
        }
      }
    })
  },

  methods: {},

  computed: {
    pageStateOptions() {
      return {
        filter: this.filter,
        page: this.page,
      }
    },
  },

  watch: {
    page() {
      this.$emit("update-page", this.page)
    },
    filter() {
      this.$emit("update-filter", this.filter)
    },

    newPage(value) {
      this.page = value
    },

    newFilter(value) {
      this.filter = value
    },

    pageStateOptions(value) {
      window.history.pushState(
        null,
        document.title,
        `${window.location.pathname}?filter=${value.filter}&page=${value.page}`,
      )
    },
  },
}
</script>

<style lang="scss" scoped></style>
