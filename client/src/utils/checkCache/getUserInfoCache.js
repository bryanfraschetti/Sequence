import { setProfileImage } from "../styling/setProfileImage";
import { SequenceNamespace } from "../SequenceNamespace";

export const getUserInfoCache = async (userID) => {
  const sequenceUrl = SequenceNamespace.getVar("sequenceUrl");

  try {
    // Try reading user cache
    const JWT = localStorage.getItem("JWT");
    const response = await fetch(`${sequenceUrl}/api/users/cache/${userID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JWT}`,
      },
    });

    // console.log(response);

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
