import { getUserInfoSpotify } from "../acessSpotify/getUserInfoSpotify";
import { getUserInfoCache } from "../checkCache/getUserInfoCache";

export const getUserid = async () => {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    // Access user info from Spotify
    console.log("Reaching spotify");
    getUserInfoSpotify();
  } else {
    // Check cache
    console.log("Checking cache");
    const cached = await getUserInfoCache(userId);
    // console.log(cached);
    if (!cached) {
      // Failure in cache
      console.log("nothing in cache");
      getUserInfoSpotify();
    }
  }
};
