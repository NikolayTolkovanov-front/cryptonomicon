const urlCurrencies =
  "https://min-api.cryptocompare.com/data/all/coinlist?summary=true"

const API_KEY =
  "2579a0b46e780867fb344a5915944d5573fecb55aac44c88c7ab4280d933b61d"

const tickersHandlers = new Map()

const socket = new WebSocket(
  `wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`,
)

const AGGREGATE_INDEX = "5"

socket.addEventListener("message", (e) => {
  const {
    TYPE: type,
    FROMSYMBOL: currency,
    PRICE: newPrice,
  } = JSON.parse(e.data)
  if (type !== AGGREGATE_INDEX || newPrice === undefined) {
    return
  }

  const handlers = tickersHandlers.get(currency) ?? []
  handlers.forEach((fn) => fn(newPrice))
})

function sendToWebSocket(message) {
  const stringifiedMessage = JSON.stringify(message)

  if (socket.readyState === WebSocket.OPEN) {
    socket.send(stringifiedMessage)
    return
  }

  socket.addEventListener(
    "open",
    () => {
      socket.send(stringifiedMessage)
    },
    { once: true },
  )
}

function subscribeToTickerOnWs(ticker) {
  sendToWebSocket({
    action: "SubAdd",
    subs: [`5~CCCAGG~${ticker}~USD`],
  })
}

function unsubscribeFromTickerOnWs(ticker) {
  sendToWebSocket({
    action: "SubRemove",
    subs: [`5~CCCAGG~${ticker}~USD`],
  })
}

export const subscribeToTicker = (ticker, cb) => {
  const subscribers = tickersHandlers.get(ticker) || []
  tickersHandlers.set(ticker, [...subscribers, cb])
  subscribeToTickerOnWs(ticker)
}

export const unsubscribeFromTicker = (ticker) => {
  tickersHandlers.delete(ticker)
  unsubscribeFromTickerOnWs(ticker)
}

export const loadCoinNamesTo = (coinList) =>
  fetch(urlCurrencies)
    .then((response) => response.json())
    .then((data) => data.Data)
    .then((res) => {
      for (let el in res) {
        coinList.push({
          Symbol: res[el]["Symbol"],
          FullName: res[el]["FullName"],
        })
      }
    })
    .catch((err) => console.error(err))
