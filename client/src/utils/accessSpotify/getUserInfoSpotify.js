import { setProfileImage } from "../styling/setProfileImage";
import { refreshTokens } from "../tokenHandling/refreshTokens";
import { tokenTimeValidity } from "../tokenHandling/tokenTimeValidity";
import { updateUserCache } from "../updateCache/updateUserCache";

export const getUserInfoSpotify = async () => {
  const refresh_token = localStorage.getItem("refresh_token");
  const tokensExpired = tokenTimeValidity();
  console.log("Getting User from Spotify");

  if (refresh_token && tokensExpired) {
    await refreshTokens();
  }

  const access_token = localStorage.getItem("access_token");

  if (!access_token) {
    return;
  }

  await fetch("https://api.spotify.com/v1/me", {
    // Spotify user end point
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: " Bearer " + access_token,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response);
      }
    })
    .then(async (response) => {
      // Get User Id and their profile image
      const userId = response.id;
      localStorage.setItem("userId", userId);

      const images = response.images;
      const profilePicUrl = images.length > 0 ? images[0].url : null;
      // Set profile image in UI if exists
      if (profilePicUrl) {
        setProfileImage(profilePicUrl);
      }

      await updateUserCache(userId, profilePicUrl);
    })
    .catch((error) => {
      //   console.error(error);
      // window.location.href = "/";
    });
};
