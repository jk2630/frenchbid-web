import axios from "axios";

const BASE_RENDER_URL = "https://frenchbid-api.onrender.com/api";
const BASE_LOCAL_URL = "http://localhost:8080/api";

class PlayerService {
  createPlayer(player) {
    return axios.post(BASE_LOCAL_URL + "/auth/players", player);
  }

  async loginPlayer(player) {
    return axios
      .post(BASE_LOCAL_URL + "/auth/login", player, {
        withCredentials: true,
      })
      .then((res) => {
        return res;
      })
      .catch((error) => {
        console.error("Login failed:", error);
        throw error;
      });
  }
}

export default new PlayerService();
