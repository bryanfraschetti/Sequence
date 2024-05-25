import { ActivateErrorNotice } from "../styling/ActivateErrorNotice";

export const refreshTokens = async () => {
  try {
    const access_token = localStorage.getItem("access_token");
    const refresh_token = localStorage.getItem("refresh_token");
    const expires = localStorage.getItem("expires"); // Get current client state
    const response = await fetch("http://127.0.0.1/api/RefreshToken", {
      // Send current state to Sequence
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        access_token: access_token,
        refresh_token: refresh_token,
        expires: expires,
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
        // Something went wrong, controlled redirect
        ActivateErrorNotice("redirect_uri");
        // window.location.href = data.redirect_uri;
      } else {
        // Something went wrong
        throw new Error("Response not Formatted as Expected");
      }
    } else {
      throw new Error("Response not OK");
    }
  } catch (error) {
    ActivateErrorNotice(error);
  }
};
