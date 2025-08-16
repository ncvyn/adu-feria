import Alpine from 'alpinejs';
window.Alpine = Alpine;

const url = import.meta.env.VITE_URL;

Alpine.data('data', () => ({
  init() {
    let pathname = window.location.pathname.substring(1);

    if (['feria', 'about'].includes(pathname)) {
      this.setPath(pathname);
    } else {
      this.setPath('/');
    }

    this.dummyData();
  },

  isLoading: false,
  responses: [],

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
        this.responses = data.map((e) => {
          return {
            ...e,
            image: `data:${e.image['$content-type']};base64,${e.image['$content']}`,
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
      'Facebook Account/Page Link': 'google.com',
      'Instagram Handle': '@neviszany',
      Type: 'Food',
      Name1: "Nevan's Fries",
      Description: 'French fries, yes.',
      Price: 80,
      image: '',
    });
  },

  setPath(path) {
    history.pushState(null, '', path);
    this.currentPath = path;
  },

  currentPath: '',
}));

Alpine.start();
