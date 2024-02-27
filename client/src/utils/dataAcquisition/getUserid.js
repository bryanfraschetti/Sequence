import { getUserInfoSpotify } from "../acessSpotify/getUserInfoSpotify";
import { getUserInfoCache } from "../checkCache/getUserInfoCache";

export const getUserid = async () => {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    // Access user info from Spotify
    getUserInfoSpotify();
  } else {
    // Check cache
    const cached = await getUserInfoCache(userId);
    // console.log(cached);
    if (!cached) {
      // Failure in cache
      getUserInfoSpotify();
    }
  }
};
