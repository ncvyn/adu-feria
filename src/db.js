export const FeriaStore = {
  db: null,

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('FeriaDB', 1)
      request.onupgradeneeded = e => {
        const db = e.target.result
        db.createObjectStore('FeriaStore', { keyPath: 'id' })
      }
      request.onsuccess = e => {
        this.db = e.target.result
        resolve()
      }
      request.onerror = reject
    })
  },

  async save(key, json) {
    const tx = this.db.transaction('FeriaStore', 'readwrite')
    tx.objectStore('FeriaStore').put({ id: key, data: json })
    return tx.complete
  },

  async load(key) {
    return new Promise(resolve => {
      const tx = this.db.transaction('FeriaStore', 'readonly')
      const request = tx.objectStore('FeriaStore').get(key)
      request.onsuccess = () => resolve(request.result?.data || null)
    })
  },
}
