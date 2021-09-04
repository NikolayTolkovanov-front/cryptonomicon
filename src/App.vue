<template>
  <div class="container mx-auto flex flex-col items-center bg-gray-100 p-4">
    <div
      v-if="loading"
      class="
        fixed
        w-100
        h-100
        opacity-80
        bg-purple-800
        inset-0
        z-50
        flex
        items-center
        justify-center
      "
    >
      <svg
        class="animate-spin -ml-1 mr-3 h-12 w-12 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
    <div class="container">
      <section>
        <div class="flex">
          <div class="max-w-xs">
            <label for="wallet" class="block text-sm font-medium text-gray-700"
              >Тикер</label
            >
            <div class="mt-1 relative rounded-md shadow-md">
              <input
                v-model="ticker"
                @keydown.enter="addTicker()"
                @input="autocomplete()"
                type="text"
                name="wallet"
                id="wallet"
                class="
                  block
                  w-full
                  pr-10
                  border-gray-300
                  text-gray-900
                  focus:outline-none focus:ring-gray-500 focus:border-gray-500
                  sm:text-sm
                  rounded-md
                "
                placeholder="Например DOGE"
                autocomplete="off"
              />
            </div>
            <div
              v-if="currencies.length"
              class="flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap"
            >
              <span
                v-for="currency in currencies"
                :key="currency.id"
                @click="addCurrency(currency)"
                class="
                  inline-flex
                  items-center
                  px-2
                  m-1
                  rounded-md
                  text-xs
                  font-medium
                  bg-gray-300
                  text-gray-800
                  cursor-pointer
                "
              >
                {{ currency }}
              </span>
            </div>
            <div v-if="tickerExist" class="text-sm text-red-600">
              Такой тикер уже добавлен
            </div>
          </div>
        </div>
        <button
          @click="addTicker()"
          type="button"
          class="
            my-4
            inline-flex
            items-center
            py-2
            px-4
            border border-transparent
            shadow-sm
            text-sm
            leading-4
            font-medium
            rounded-full
            text-white
            bg-gray-600
            hover:bg-gray-700
            transition-colors
            duration-300
            focus:outline-none
            focus:ring-2
            focus:ring-offset-2
            focus:ring-gray-500
          "
        >
          <!-- Heroicon name: solid/mail -->
          <svg
            class="-ml-0.5 mr-2 h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="#ffffff"
          >
            <path
              d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
            ></path>
          </svg>
          Добавить
        </button>
        <p class="block text-sm font-medium text-gray-700">Фильтр: 
          <input
            v-model="filter" 
            class="
                block
                w-100
                pr-10
                border-gray-300
                text-gray-900
                focus:outline-none focus:ring-gray-500 focus:border-gray-500
                sm:text-sm
                rounded-md
                " 
            type="text">
        </p>
        <button
        v-if="page > 1"
        @click="page = page - 1"
        class="
            my-4
            inline-flex
            items-center
            py-2
            px-4
            border border-transparent
            shadow-sm
            text-sm
            leading-4
            font-medium
            rounded-full
            text-white
            bg-gray-600
            hover:bg-gray-700
            transition-colors
            duration-300
            focus:outline-none
            focus:ring-2
            focus:ring-offset-2
            focus:ring-gray-500
            mr-5
          ">Назад</button>
        <button
        v-if="hasNextPage"
        @click="page = page + 1"
         class="
            my-4
            inline-flex
            items-center
            py-2
            px-4
            border border-transparent
            shadow-sm
            text-sm
            leading-4
            font-medium
            rounded-full
            text-white
            bg-gray-600
            hover:bg-gray-700
            transition-colors
            duration-300
            focus:outline-none
            focus:ring-2
            focus:ring-offset-2
            focus:ring-gray-500
            mr-5
          ">Вперед</button>
      </section>

      <template v-if="tickers.length && filteredTickers.length">
        <hr class="w-full border-t border-gray-600 my-4" />
        <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div
            v-for="elem in paginatedTickers"
            @click="selectTicker(elem)"
            :key="elem.id"
            :class="{ 'border-4': selectedTicker === elem }"
            class="
              bg-white
              overflow-hidden
              shadow
              rounded-lg
              border-purple-800 border-solid
              cursor-pointer
            "
          >
            <div class="flex flex-col px-4 py-5 sm:p-6 text-center">
              <dt class="text-sm font-medium text-gray-500 truncate">
                {{ elem.name }}
              </dt>
              <dd class="mt-1 text-3xl font-semibold text-gray-900">
                {{ elem.price }}
              </dd>
            </div>
            <div class="w-full border-t border-gray-200"></div>
            <button
              @click.stop="
                removeTicker(elem)
              "
              class="
                flex
                self-end
                items-center
                justify-center
                font-medium
                w-full
                bg-gray-100
                px-4
                py-4
                sm:px-6
                text-md text-gray-500
                hover:text-gray-600 hover:bg-gray-200 hover:opacity-20
                transition-all
                focus:outline-none
              "
            >
              <svg
                class="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="#718096"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                ></path></svg
              >Удалить
            </button>
          </div>
        </dl>
        <hr class="w-full border-t border-gray-600 my-4" />
      </template>

      <section v-if="selectedTicker" class="relative">
        <h3 class="text-lg leading-6 font-medium text-gray-900 my-8">
          {{ selectedTicker.name }} - USD
        </h3>
        <div class="flex items-end border-gray-600 border-b border-l h-64">
          <div
            v-for="(bar, idx) in normalizedGraph"
            :key="idx"
            :style="{ height: `${bar}%` }"
            class="bg-purple-800 border w-10"
          ></div>
        </div>
        <button
          @click="selectedTicker = null"
          type="button"
          class="absolute top-0 right-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            xmlns:svgjs="http://svgjs.com/svgjs"
            version="1.1"
            width="30"
            height="30"
            x="0"
            y="0"
            viewBox="0 0 511.76 511.76"
            style="enable-background: new 0 0 512 512"
            xml:space="preserve"
          >
            <g>
              <path
                d="M436.896,74.869c-99.84-99.819-262.208-99.819-362.048,0c-99.797,99.819-99.797,262.229,0,362.048    c49.92,49.899,115.477,74.837,181.035,74.837s131.093-24.939,181.013-74.837C536.715,337.099,536.715,174.688,436.896,74.869z     M361.461,331.317c8.341,8.341,8.341,21.824,0,30.165c-4.16,4.16-9.621,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    l-75.413-75.435l-75.392,75.413c-4.181,4.16-9.643,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    c-8.341-8.341-8.341-21.845,0-30.165l75.392-75.413l-75.413-75.413c-8.341-8.341-8.341-21.845,0-30.165    c8.32-8.341,21.824-8.341,30.165,0l75.413,75.413l75.413-75.413c8.341-8.341,21.824-8.341,30.165,0    c8.341,8.32,8.341,21.824,0,30.165l-75.413,75.413L361.461,331.317z"
                fill="#718096"
                data-original="#000000"
              ></path>
            </g>
          </svg>
        </button>
      </section>
    </div>
  </div>
</template>

<script>
// [x] Наличие в состоянии ЗАВИСИМЫХ ДАННЫХ | Критичность: 5+
// [ ] Запросы напрямую внутри компонента (???) | Критичность: 5
// [ ] При удалении остается подписка на загрузку тикера | Критичность: 5
// [ ] Обработка ошибок API | Критичность: 5
// [ ] Количество запросов | Критичность: 4
// [x] При удалении тикера не изменяется localStorage | Критичность: 4
// [x] Одинаковый код в watch | Критичность: 3
// [ ] localStorage и анонимные вкладки | Критичность: 3
// [x] График ужасно выглядит если будет много цен | Критичность: 2
// [ ].Магические строки и числа (URL, 5000 миллисекунд задержки, ключ локал стораджа, количество на странице) |  Критичность: 1

// Параллельно
// [x] График сломан если везде одинаковые значения
// [x] При удалении тикера остается выбор
export default {
  name: "App",

  data() {
    return {
      ticker: "", // Значение в input
      filter: "", // фильтр

      tickers: [], // Массив с объектами название - число
      graph: [], // Массив со значением высот для столбиков в графике
      currencies: ["BTC", "USD", "DOGE", "BCH"], // Массив для найденных валют
      allCurrencies: [], // массив с данными fetch

      selectedTicker: null, // Значение для выбранного тикера
      loading: true, // Флажок для элемента загрузки страницы
      tickerExist: false, // Флажок, добалена ли валюта

      page: 1, // Текущая страница пагинации
    };
  },

  created() {
    window.onload = () => this.loading = false

    const windowData = Object.fromEntries(
      new URL(window.location).searchParams.entries()
    );

    const VALID_KEYS = ["filter", "page"];
    
    VALID_KEYS.forEach(key => {
      if (windowData[key]) {
        this[key] = windowData[key];
      }
    });

    // Тикеры остаются при перезагрузке страницы
    const dataTickers = localStorage.getItem('cryptonomicon-list')
    
    if (dataTickers) {
      this.tickers = JSON.parse(dataTickers)
      this.tickers.forEach(ticker => {
        this.subscribeToUpdates(ticker.name)
      });
    }
    // Запрос имен криптовалют
    const url = "https://min-api.cryptocompare.com/data/all/coinlist?summary=true";

    fetch(url)
      .then((response) => response.json())
      .then((data) => data.Data)
      .then((res) => {
        for (let el in res) {
          this.allCurrencies.push(res[el]);
        }
      })
      .catch((err) => console.error(err));
  },

  computed: {
    startIndex() {
      return (this.page - 1) * 6;
    },

    endIndex() {
      return this.page * 6;
    },

    filteredTickers() {
      return this.tickers.filter(ticker => ticker.name.slice(0, this.filter.length).toUpperCase() === this.filter.toUpperCase());
    },

    paginatedTickers() {
      return this.filteredTickers.slice(this.startIndex, this.endIndex);
    },

    hasNextPage() {
      return this.filteredTickers.length > this.endIndex;
    },

    normalizedGraph() {
      const maxValue = Math.max(...this.graph);
      const minValue = Math.min(...this.graph);

      if (maxValue === minValue) {
        return this.graph.map(() => 50);
      }

      return this.graph.map(
        price => 5 + ((price - minValue) * 95) / (maxValue - minValue)
      );
    },

    pageStateOptions() {
      return {
        filter: this.filter,
        page: this.page
      };
    }
  },

  methods: {
    // Обновление данных
    subscribeToUpdates(tickerName) {
      setTimeout(async () => {
            const f = await fetch(
              `https://min-api.cryptocompare.com/data/price?fsym=${tickerName}&tsyms=USD&api_key=2579a0b46e780867fb344a5915944d5573fecb55aac44c88c7ab4280d933b61d`
            );

            const response = await f.json();
            const trueTicker = this.tickers.find(
              (ticker) => ticker.name === tickerName
            );

            if (trueTicker !== undefined) {
              trueTicker.price = response.USD;
            }

            if (this.selectedTicker?.name === tickerName) {
              this.graph.push(response.USD);
            }
          }, 10000);

          this.ticker = "";
    },
    // Добавить тикер
    addTicker() {
      if (this.ticker !== "") {
        if (this.tickers.every(ticker => ticker.name != this.ticker.toUpperCase())) {

          const currentTicker = {
            name: this.ticker.toUpperCase(),
            price: "please, wait",
          };

          this.tickers = [...this.tickers, currentTicker];
          this.filter = ""

          this.subscribeToUpdates(currentTicker.name)
          
        } else {
          this.tickerExist = true;
        }
      }
    },
    // Удалить только тикер
    removeTicker(tickerToRemove) {
      this.tickers = this.tickers.filter(ticker => ticker !== tickerToRemove);

      if (this.selectedTicker === tickerToRemove) {
        this.selectedTicker = null
        this.tickerExist = false
      }
    },
    // Нажатие на тикер
    selectTicker(ticker) {
      this.selectedTicker = ticker;
    },
    // Валидация имени криптовалюты
    autocomplete() {
      console.log('autocomplete')
      this.tickerExist = false;
      this.currencies = [];
      // Пока длина строки выбора валют меньше 4 или пока список валют не закончится
      for (let i = 0; i < this.allCurrencies.length && this.currencies.length < 4; i++) {
        let fullName = this.allCurrencies[i].FullName
        let symbol = this.allCurrencies[i].Symbol

        if (fullName.slice(0,this.ticker.length).toUpperCase() === this.ticker.toUpperCase() ||
          symbol.slice(0, this.ticker.length).toUpperCase() === this.ticker.toUpperCase()) 
          {
            this.currencies = 
            [...this.currencies, symbol.toUpperCase()] ||
            [...this.currencies, fullName.toUpperCase()] 
        }
      }

      if (this.ticker == "") {
        this.currencies = [];
      }
    },
    // Добавление валюты при нажатии на список валют
    addCurrency(currentCurrency) {
      this.ticker = currentCurrency;
      this.tickerExist = true;

      if (this.tickers.every((el) => el.name !== currentCurrency)) {
        this.addTicker();
        this.ticker = currentCurrency;
      } 

      if (this.ticker === "") {
        this.currencies = []
      }
    },
  },

  watch: {
    selectedTicker() {
      this.graph = []
    },

    tickers() {
      localStorage.setItem('cryptonomicon-list', JSON.stringify(this.tickers))
    },

    paginatedTickers() {
      if (this.paginatedTickers.length === 0 && this.page > 1) {
        this.page -= 1;
      }
    },

    filter() {
      this.page = 1
    },

    pageStateOptions(value) {
      window.history.pushState(
        null,
        document.title,
        `${window.location.pathname}?filter=${value.filter}&page=${value.page}`
      );
    }
  },
};
</script>
