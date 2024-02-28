import { setProfileImage } from "../styling/setProfileImage";

export const getUserInfoCache = async (userID) => {
  try {
    // Try reading user cache
    const response = await fetch("/getUserCache", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userID,
      }),
    });

    console.log("RESPONSE:", response);
    console.log("RESPONSE.json():", response.json);
    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // Read cached data
    const data = await response.json();
    console.log(data);
    const cachedUser = data.userCache;
    const profileUrl = cachedUser.profilePicUrl;

    // If profile picture, update UI
    if (profileUrl) {
      setProfileImage(profileUrl);
    }

    // Inform success
    return true;
  } catch (err) {
    console.log(err);
    // Failure in reading cache
    // console.error("Error Reading User Cache", err);
    return false;
  }
};
