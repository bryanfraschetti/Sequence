import { ActivateAnimation } from "../styling/ActivateAnimation";
import { tokenTimeValidity } from "./tokenTimeValidity";
import { refreshTokens } from "./refreshTokens";
import { getPlaylists } from "../dataAcquisition/getPlaylists";
import { getUserInfo } from "../dataAcquisition/getUserInfo";
import { ActivateErrorNotice } from "../styling/ActivateErrorNotice";

export const Exchange = async () => {
  ActivateAnimation(); //loading animation
  const access_token = localStorage.getItem("access_token");
  const refresh_token = localStorage.getItem("refresh_token");
  const expires = localStorage.getItem("expires"); // Get current client state
  const JWT = localStorage.getItem("JWT");
  const tokensExpired = tokenTimeValidity();

  if (refresh_token && tokensExpired) {
    await refreshTokens();
  } else {
    try {
      // Send tokens to Sequence
      const response = await fetch("/api/AccessToken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_token: access_token,
          refresh_token: refresh_token,
          expires: expires,
          JWT: JWT, // Post current state to Sequence endpoint
        }),
      });
      if (response.ok) {
        const data = await response.json();
        if (
          data.access_token &&
          data.refresh_token &&
          data.expires &&
          data.JWT
        ) {
          // All are successfully defined
          localStorage.setItem("access_token", data.access_token);
          localStorage.setItem("refresh_token", data.refresh_token);
          localStorage.setItem("expires", data.expires);
          localStorage.setItem("JWT", data.JWT);
        } else if (data.redirect_uri) {
          // Not logged in
          const NotLoggedIn = document.getElementById("not-logged-in");
          const LoadingAnimation = document.getElementById("loading-container");
          LoadingAnimation.style.display = "none"; // Stop showing loading animation
          NotLoggedIn.style.display = "block"; // Show not logged in state
          return; // Stop code execution
        } else {
          // Something unforeseen went wrong
          throw new Error("Response not Formatted as Expected");
        }
      } else {
        // Something went wrong with my server
        throw new Error("Response from Sequence not OK");
      }
    } catch (error) {
      ActivateErrorNotice(error);
    }
  }

  await getUserInfo();
  await getPlaylists();
  ActivateAnimation();
};
