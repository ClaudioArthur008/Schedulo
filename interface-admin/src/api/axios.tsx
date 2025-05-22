import axios from 'axios';

// Adapter pour Next.js (au lieu de REACT_APP_)
const API_PORT = process.env.NEXT_PUBLIC_API_PORT || '3002';

const getBaseUrl = () => {
  // Vérifier si window est défini (côté client uniquement)
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    if (hostname === 'localhost') {
      return `http://localhost:${API_PORT}`;
    }
    
    // Utiliser HTTPS en production
    return `https://${hostname}:${API_PORT}`;
  }
  
  // Valeur par défaut pour le rendu côté serveur
  return `http://localhost:${API_PORT}`;
};

const getAuthToken = () => {
  try {
    // Essayer d'abord sessionStorage (plus sécurisé pour les tokens)
    const userJsonSession = sessionStorage.getItem('user');
    if (userJsonSession) {
      const userSession = JSON.parse(userJsonSession);
      if (userSession?.token) return userSession.token;
    }
    
    // Sinon, essayer localStorage
    const userJsonLocal = localStorage.getItem('user');
    if (userJsonLocal) {
      const userLocal = JSON.parse(userJsonLocal);
      if (userLocal?.token) return userLocal.token;
    }
    
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération du token:', error);
    return null;
  }
};

const api = (token: string) => {
  const instance = axios.create({
    baseURL: getBaseUrl(),
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true
  });

  // Intercepteur pour les requêtes
  instance.interceptors.request.use(
    (config) => {
      // Ne pas exécuter côté serveur
      if (typeof window === 'undefined') return config;

      const token = getAuthToken();

      if (token) {
        // Ajouter le token à toutes les requêtes
        config.headers.Authorization = `Bearer ${token}`;

        // Débogage - à retirer en production
        console.log('Requête authentifiée vers:', config.url);
      } else {
        // Débogage - à retirer en production
        console.warn('Requête non authentifiée vers:', config.url);
      }

      return config;
    },
    (error) => {
      console.error('Erreur dans l\'intercepteur de requête Axios:', error);
      return Promise.reject(error);
    }
  );

  // Intercepteur pour les réponses
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // Gérer les erreurs d'authentification
      if (error.response && error.response.status === 401) {
        console.error('Erreur d\'authentification 401:', error.response.data);

      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export default api;