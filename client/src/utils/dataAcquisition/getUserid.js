import { getUserInfoSpotify } from "../accessSpotify/getUserInfoSpotify";
import { getUserInfoCache } from "../checkCache/getUserInfoCache";

export const getUserid = async () => {
  const userId = localStorage.getItem("userId");

  if (!userId) {
    // Access user info from Spotify
    await getUserInfoSpotify();
  } else {
    // Check cache
    const cached = await getUserInfoCache(userId);
    if (!cached) {
      // Failure in cache
      await getUserInfoSpotify();
    }
  }
};
