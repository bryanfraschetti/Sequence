import { ActivateAnimation } from "../styling/ActivateAnimation";
import { tokenTimeValidity } from "./tokenTimeValidity";
import { refreshTokens } from "./refreshTokens";
import { refreshPlaylists } from "../dataAcquisition/refreshPlaylists";

export const Exchange = async () => {
  ActivateAnimation(); //loading animation
  const access_token = localStorage.getItem("access_token");
  const refresh_token = localStorage.getItem("refresh_token");
  const expires = localStorage.getItem("expires"); //get current states
  const tokensExpired = tokenTimeValidity();

  if (refresh_token && tokensExpired) {
    await refreshTokens();
  } else {
    try {
      //send tokens to Sequence
      const response = await fetch("/AccessToken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_token: access_token,
          refresh_token: refresh_token,
          expires: expires, //post current state to endpoint
        }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.access_token && data.refresh_token && data.expires) {
          //all are successfully defined
          localStorage.setItem("access_token", data.access_token);
          localStorage.setItem("refresh_token", data.refresh_token);
          localStorage.setItem("expires", data.expires);
        } else if (data.redirect_uri) {
          //something went wrong refreshing with spotify, controlled redirect
          window.location.href = data.redirect_uri;
        } else {
          //something unforeseen went wrong
          throw new Error("Response not Formatted as Expected");
        }
      } else {
        //something went wrong with my server
        throw new Error("Response from Sequence not OK");
      }
    } catch (error) {
      window.location.href = "/";
    }
  }

  //function to get user profile could be nice
  await refreshPlaylists();
  ActivateAnimation();
};