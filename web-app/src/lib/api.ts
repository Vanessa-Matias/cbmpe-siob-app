import axios from "axios";

// Aqui defino o endereço "base". O Axios vai completar o resto pra gente.
export const api = axios.create({
  baseURL: "https://siob-back-end.onrender.com/api/v1", 
});

// Essa parte é mágica: Toda vez que o Axios fizer um pedido, 
// ele vai checar se tem um "crachá" (token) no bolso do navegador.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Tenta pegar o token salvo
  
  if (token) {
    // Se tiver token, cola ele na testa da requisição para o backend deixar entrar
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});