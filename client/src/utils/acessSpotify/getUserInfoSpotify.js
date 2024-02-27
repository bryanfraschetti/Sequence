import { setProfileImage } from "../styling/setProfileImage";
import { refreshTokens } from "../tokenHandling/refreshTokens";
import { tokenTimeValidity } from "../tokenHandling/tokenTimeValidity";

export const getUserInfoSpotify = async () => {
  const access_token = localStorage.getItem("access_token");
  const refresh_token = localStorage.getItem("refresh_token");
  const tokensExpired = tokenTimeValidity();

  if (refresh_token && tokensExpired) {
    await refreshTokens();
  }
  fetch("https://api.spotify.com/v1/me", {
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
    .then((response) => {
      // Get User Id and their profile image
      const userId = response.id;
      localStorage.setItem("userId", userId);

      const images = response.images;
      const profilePicUrl = images.length > 0 ? images[0].url : null;
      // Set profile image in UI if exists
      if (profilePicUrl) {
        setProfileImage(profilePicUrl);
      }

      fetch("/createUserCache", {
        // Cache Image (or the lack thereof)
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          profilePicUrl: profilePicUrl,
        }),
      });
    })
    .catch((error) => {
      console.error(error);
      // window.location.href = "/";
    });
};
