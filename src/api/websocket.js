const URL_WEBSOCKET = "wss://streamer.cryptocompare.com/v2?api_key="

const API_KEY =
  "2579a0b46e780867fb344a5915944d5573fecb55aac44c88c7ab4280d933b61d"

const tickersHandlers = new Map()
const invalidTickerHandlers = new Map()

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

  const invalidCurrency = getCurrencyFromMessage(param)

  if (message === "INVALID_SUB") {
    const invalidHandlers = invalidTickerHandlers.get(invalidCurrency) ?? []
    invalidHandlers.forEach((fn) => fn(invalidCurrency))
  }

  if (type !== AGGREGATE_INDEX || newPrice === undefined) {
    return
  }

  // Получаем список функций к валюте и исполняем их
  const handlers = tickersHandlers.get(currency) ?? []
  handlers.forEach((fn) => fn(newPrice))
})

function getCurrencyFromMessage(message = "") {
  let fromSymbol = message.split("~")[2]
  return fromSymbol
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

// Добавляет все тикекры
export const subscribeToInvalidTicker = (ticker, cb) => {
  const subscribers = invalidTickerHandlers.get(ticker) || []
  invalidTickerHandlers.set(ticker, [...subscribers, cb])
}

export const unsubscribeFromInvalidTicker = (ticker, cb) => {
  invalidTickerHandlers.delete(ticker)
  cb(ticker)
}
