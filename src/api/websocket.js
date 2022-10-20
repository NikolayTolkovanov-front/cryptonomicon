const URL_WEBSOCKET = "wss://streamer.cryptocompare.com/v2?api_key="

const API_KEY =
  "2579a0b46e780867fb344a5915944d5573fecb55aac44c88c7ab4280d933b61d"

const tickersHandlers = new Map()
let invalidCurrencies = []

const AGGREGATE_INDEX = "5"

const socket = new WebSocket(`${URL_WEBSOCKET}${API_KEY}`)

// При получении сообщения находим нужную валюту
socket.addEventListener("message", (e) => {
  const {
    TYPE: type,
    FROMSYMBOL: currency,
    PRICE: newPrice,
    MESSAGE: message,
    PARAMETER: param,
  } = JSON.parse(e.data)

  if (message === "INVALID_SUB") {
    let invalidCurrency = getCurrencyFromMessage(param)
    invalidCurrencies = [...invalidCurrencies, invalidCurrency]
  } else if (message === "SUBSCRIPTION_UNRECOGNIZED") {
    let invalidCurrency = getCurrencyFromMessage(param)

    if (invalidCurrencies.includes(invalidCurrency)) {
      invalidCurrencies = invalidCurrencies.filter(
        (currency) => currency !== invalidCurrency,
      )
    }
  }

  if (type !== AGGREGATE_INDEX || newPrice === undefined) {
    return
  }

  // Получаем список функций к валюте и исполняем их
  const handlers = tickersHandlers.get(currency) ?? []
  handlers.forEach((fn) => fn(newPrice))
})

function getCurrencyFromMessage(message) {
  return message.split("~")[2]
}

// Отправка сообщения на действие(отписка, подписка) и на какую валюту подписаться
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

export const getInvalidTickers = () => {
  return invalidCurrencies
}
