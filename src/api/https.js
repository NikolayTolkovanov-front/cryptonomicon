const URL_COIN_LIST =
  "https://min-api.cryptocompare.com/data/all/coinlist?summary=true"

export const loadCoinNamesTo = (currencyList) =>
  fetch(URL_COIN_LIST)
    .then((response) => response.json())
    .then((data) => data.Data)
    .then((res) => {
      for (let el in res) {
        currencyList.push({
          Symbol: res[el]["Symbol"],
          FullName: res[el]["FullName"],
        })
      }
    })
    .catch((err) => console.error(err))
