function getDemoBookmarks() {
  const bookmarks = []

  const moodle = {
    url: 'https://moodle.oakland.edu',
    name: 'Moodle',
    created_at: Date.now(),
    description: 'student class information'
  }

  const sail = {
    url: 'https://sail.oakland.edu',
    name: 'Sail',
    created_at: Date.now(),
    description: 'student information and class registration'
  }

  const library = {
    url: 'https://library.oakland.edu/',
    name: 'Library',
    created_at: Date.now(),
    description: 'Kresge Library'
  }

  bookmarks.push(moodle)
  bookmarks.push(sail)
  bookmarks.push(library)

  return bookmarks
}

function getDemoFolder() {
  const folder = []

  const webmail = {
    url: 'https://webmail.oakland.edu',
    name: 'Webmail',
    created_at: Date.now(),
    description: 'Google e-mail service'
  }

  const drive = {
    url: 'https://drive.google.com/a/oakland.edu',
    name: 'Drive',
    created_at: Date.now(),
    description: 'Google storage service'
  }

  const calender = {
    url: 'https://calendar.google.com/a/oakland.edu',
    name: 'Calender',
    created_at: Date.now(),
    description: 'Google calendar service'
  }

  folder.push(webmail)
  folder.push(drive)
  folder.push(calender)

  return folder
}

export const getDemoData = () => {
  const demoBookmarks = getDemoBookmarks()
  const demoFolder = getDemoFolder()
  const newData = {
    root: demoBookmarks,
    'Google Tools': demoFolder
  }

  return newData
}
