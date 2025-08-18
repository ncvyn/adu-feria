import Alpine from 'alpinejs';
window.Alpine = Alpine;

const url = import.meta.env.VITE_URL;

Alpine.data('data', () => ({
  init() {
    let pathname = window.location.hash.slice(1);

    if (['feria', 'about'].includes(pathname)) {
      this.setPath(pathname);
    } else {
      this.setPath('/');
    }

    this.getData();
  },

  isLoading: false,
  responses: [],
  searchQuery: '',
  filterQuery: 'Show all',

  getData() {
    this.isLoading = true;
    fetch(url, {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        data.sort(() => Math.random() - 0.5);

        this.responses = data.map((e) => {
          return {
            ...e,
            image: `data:${e.image['$content-type']};base64,${e.image['$content']}`,
            'Facebook Account/Page Link': (() => {
              const link = e['Facebook Account/Page Link'];
              link.startsWith('http://') || link.startsWith('https://')
                ? link
                : `https://${link}`;
            })(),
            'Instagram Handle': (() => {
              const handle = e['Instagram Handle'];
              handle ? `(${handle})` : '';
            })(),
          };
        });
        console.log(this.responses);

        this.isLoading = false;
      })
      .catch((error) => {
        console.log('Error:', error);
      });
  },

  dummyData() {
    this.responses = new Array(10).fill({
      Id: 5,
      'Start time': 45881.4073148148,
      'Completion time': 45881.4079166667,
      Email: 'nevan.angelo.catoy@k12.adamson.edu.ph',
      Name: 'Nevan Angelo Catoy',
      Consent: 'I consent.',
      'Facebook Account/Page Link': 'https://google.com',
      'Instagram Handle': '(@neviszany)',
      Type: 'Food',
      Name1: "Nevan's Fries",
      Description: 'French fries, yes.',
      Price: 80,
      image: '',
    });
  },

  setPath(path) {
    history.pushState(null, '', `#${path}`);
    this.currentPath = path;
  },

  currentPath: '',
}));

Alpine.start();
