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

export const addUser = async (feedUrl, folderOb) => {
  const bodyData = {data: folderOb}
  const formBody = encodeUrl(bodyData)

  const response = await fetch(feedUrl, {
    body: formBody,
    credentials: 'include',
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'cache-control': 'no-cache'
    }
  })

  const newData = await response.json()
  return newData
}

export const addPref = async feedUrl => {
  const response = await fetch(feedUrl, {
    credentials: 'include',
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'cache-control': 'no-cache'
    }
  })

  const newData = await response.json()
  return newData
}

export const addToFolder = async (feedUrl, folder, bookmark) => {
  const bodyData = {data: bookmark, folder: folder}
  const formBody = encodeUrl(bodyData)

  const response = await fetch(feedUrl, {
    body: formBody,
    credentials: 'include',
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'cache-control': 'no-cache'
    }
  })

  const newData = await response.json()
  return newData
}

export const removeFromFolder = async (feedUrl, folderName, bookmark, loc) => {
  const bodyData = {folder: folderName, bookmark: bookmark, location: loc}
  const formBody = encodeUrl(bodyData)

  const response = await fetch(feedUrl, {
    body: formBody,
    credentials: 'include',
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'cache-control': 'no-cache'
    }
  })

  const newData = await response.json()
  return newData
}

export const addBookmark = async (feedUrl, bookmark) => {
  const bookmarkData = {
    name: bookmark[0],
    url: bookmark[1],
    description: bookmark[2],
    created_at: bookmark[3]
  }
  const bodyData = {data: bookmarkData}
  const formBody = encodeUrl(bodyData)

  const response = await fetch(feedUrl, {
    body: formBody,
    credentials: 'include',
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'cache-control': 'no-cache'
    }
  })

  const newData = response.json()
  return newData
}

export const addFolder = async (feedUrl, name) => {
  const bodyData = {folder: name}
  const formBody = encodeUrl(bodyData)

  const response = await fetch(feedUrl, {
    body: formBody,
    credentials: 'include',
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'cache-control': 'no-cache'
    }
  })

  const newData = await response.json()
  return newData
}

export const changeBookmark = async (feedUrl, loc, folder, bookmark) => {
  const data = {
    url: bookmark[0],
    name: bookmark[1],
    description: bookmark[2],
    created_at: Date.now().toString()
  }

  const bodyData = {data: data, folder: folder, location: loc}
  const formBody = encodeUrl(bodyData)

  const response = await fetch(feedUrl, {
    body: formBody,
    credentials: 'include',
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'cache-control': 'no-cache'
    }
  })

  const newData = await response.json()
  return newData
}

export const changeFolder = async (feedUrl, oldFolder, folder) => {
  const bodyData = {folder: folder, oldfolder: oldFolder}
  const formBody = encodeUrl(bodyData)

  const response = await fetch(feedUrl, {
    body: formBody,
    credentials: 'include',
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'cache-control': 'no-cache'
    }
  })

  const newData = await response.json()
  return newData
}

export const removeFolder = async (feedUrl, folder) => {
  const bodyData = {folder: folder}
  const formBody = encodeUrl(bodyData)

  const response = await fetch(feedUrl, {
    body: formBody,
    credentials: 'include',
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'cache-control': 'no-cache'
    }
  })

  const newData = await response.json()
  return newData
}

export const removeBookmark = async (feedUrl, folder, loc) => {
  const bodyData = {folder: folder, bookmarkLocation: loc}
  const formBody = encodeUrl(bodyData)

  const response = await fetch(feedUrl, {
    body: formBody,
    credentials: 'include',
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'cache-control': 'no-cache'
    }
  })

  const newData = await response.json()
  return newData
}
