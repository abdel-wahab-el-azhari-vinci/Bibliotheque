import axios from 'axios';

const API_URL = 'http://localhost:8082';

const httpClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default httpClient;
