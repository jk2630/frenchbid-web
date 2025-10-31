import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_ENDPOINT;

// unAuthenticated api's
class PlayerService {
  createPlayer(player) {
    return axios.post(BASE_URL + "/auth/players", player);
  }

  async loginPlayer(player) {
    console.log("base url is:", BASE_URL);
    return axios
      .post(BASE_URL + "/auth/login", player, {
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

  async logoutPlayer(playerName) {
    const logoutRequest = {
      playerName: playerName,
    };
    const res = axios
      .post(BASE_URL + "/auth/logout", logoutRequest)
      .catch((error) => {
        console.log("Logout failed:", error);
        throw error;
      });
    return res.data;
  }
}

export default new PlayerService();
