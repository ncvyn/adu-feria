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

    this.getData();
  },

  isLoading: false,
  responses: [],

  getData() {
    this.isLoading = true;
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        this.responses = data;

        console.log(this.responses);
        this.isLoading = false;
      })
      .catch((error) => {
        console.log('Error:', error);
      });
  },

  dummyData() {
    this.responses = new Array(10).fill({
      timestamp: '06/08/2025 13:50:57',
      email: 'email@email.com',
      fullName: 'fname',
      instEmail: 'iemail',
      personalEmail: 'persemail',
      pageLink: 'fbacc',
      handleLink: 'handle',
      serviceType: 'Others',
      serviceName: 'business',
      description: 'description',
      price: '457',
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
