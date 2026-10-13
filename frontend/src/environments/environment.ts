export const environment = {
  production: true,
  // Canlıya aldığınızda Render/Railway backend URL'inizi buraya yazabilirsiniz.
  // Örn: 'https://restaurant-nfc-backend.onrender.com/api'
  apiUrl: (typeof window !== 'undefined' && window.location.hostname === 'localhost')
    ? 'http://localhost:3001/api'
    : 'https://restaurant-nfc-backend.onrender.com/api'
};
