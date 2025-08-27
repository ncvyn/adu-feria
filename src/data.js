import Alpine from 'alpinejs'
window.Alpine = Alpine

import { FeriaStore } from './db.js'
await FeriaStore.init()

const url = import.meta.env.VITE_URL
const token = import.meta.env.VITE_TOKEN

const data = JSON.parse(await FeriaStore.load('formData'))

Alpine.data('data', () => ({
  init() {
    let pathname = window.location.hash.slice(1)

    if (['feria', 'about'].includes(pathname)) {
      this.setPath(pathname)
    } else {
      this.setPath('/')
    }

    if (data) {
      this.responses = data
      this.responses.sort(() => Math.random() - 0.5)
    } else {
      this.getData()
    }
  },

  isLoading: false,
  responses: [],
  searchQuery: '',
  filterQuery: 'Show all',

  getData() {
    this.isLoading = true
    fetch(`${url}&key=${token}`, {
      method: 'GET',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then(async data => {
        data.sort(() => Math.random() - 0.5)

        this.responses = data.map(e => {
          return {
            ...e,
            'image': `data:${e.image['$content-type']};base64,${e.image['$content']}`,
            'Link': (() => {
              const link = e['Link']
              link.startsWith('http://') || link.startsWith('https://')
                ? link
                : `https://${link}`
            })(),
            'Instagram Handle': (() => {
              const handle = e['Instagram Handle']
              handle ? `(${handle})` : ''
            })(),
          }
        })
        await FeriaStore.save('formData', JSON.stringify(this.responses))

        this.isLoading = false
      })
      .catch(error => {
        console.log('Error:', error)
      })
  },

  setPath(path) {
    history.pushState(null, '', `#${path}`)
    this.currentPath = path
  },

  currentPath: '',
}))

Alpine.start()
