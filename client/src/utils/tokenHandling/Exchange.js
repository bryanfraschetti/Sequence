import { ActivateAnimation } from "../styling/ActivateAnimation";
import { tokenTimeValidity } from "./tokenTimeValidity";
import { refreshTokens } from "./refreshTokens";
import { refreshPlaylists } from "../dataAcquisition/refreshPlaylists";
import { getUserid } from "../dataAcquisition/getUserid";
import { ActivateErrorNotice } from "../styling/ActivateErrorNotice";

export const Exchange = async () => {
  ActivateAnimation(); //loading animation
  const access_token = localStorage.getItem("access_token");
  const refresh_token = localStorage.getItem("refresh_token");
  const expires = localStorage.getItem("expires"); // Get current client state
  const tokensExpired = tokenTimeValidity();

  if (refresh_token && tokensExpired) {
    await refreshTokens();
  } else {
    try {
      // Send tokens to Sequence
      const response = await fetch("/AccessToken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_token: access_token,
          refresh_token: refresh_token,
          expires: expires, // Post current state to Sequence endpoint
        }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.access_token && data.refresh_token && data.expires) {
          // All are successfully defined
          localStorage.setItem("access_token", data.access_token);
          localStorage.setItem("refresh_token", data.refresh_token);
          localStorage.setItem("expires", data.expires);
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

  await getUserid();
  console.log("user is received");
  await refreshPlaylists();
  console.log("playlists refreshed");
  ActivateAnimation();
};
