function encodeUrl(data) {
  const formBody = Object.keys(data)
    .map(
      key =>
        encodeURIComponent(key) +
        '=' +
        encodeURIComponent(JSON.stringify(data[key]))
    )
    .join('&')
  return formBody
}

export const getData = async url => {
  const response = await fetch(url, {credentials: 'include'})
  const newData = await response.json()
  return newData
}

export const savePreferences = async (feedUrl, pref) => {
  const bodyData = {itemsPref: pref}
  const formBody = encodeUrl(bodyData)

  const response = await fetch(feedUrl, {
    body: formBody,
    credentials: 'include',
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })

  const newData = await response.json()
  return newData
}
