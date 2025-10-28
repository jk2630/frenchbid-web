import axios from "axios";

const BASE_RENDER_URL = "https://frenchbid-api.onrender.com/players";
const BASE_LOCAL_URL = "http://localhost:8080/players";

class PlayerService {
  createPlayer(player) {
    return axios.post(BASE_LOCAL_URL, player);
  }
}

export default new PlayerService();
