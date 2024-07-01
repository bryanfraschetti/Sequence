import { setProfileImage } from "../styling/setProfileImage";

export const getUserInfoCache = async (userID) => {
  try {
    // Try reading user cache
    const response = await fetch(`/api/users/cache/${userID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // Read cached data
    const data = await response.json();

    const cachedUser = data.userCache;
    const profileUrl = cachedUser.profilePicUrl;

    // If profile picture, update UI
    if (profileUrl) {
      setProfileImage(profileUrl);
    }

    // Inform success
    return true;
  } catch (err) {
    // console.error(err);
    // Failure in reading cache
    // console.error("Error Reading User Cache", err);
    return false;
  }
};
