import { setProfileImage } from "../styling/setProfileImage";

export const getUserid = () => {
  const access_token = localStorage.getItem("access_token");

  fetch("https://api.spotify.com/v1/me", {
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
      localStorage.setItem("userId", response.id);
      const images = response.images;
      if (images.length > 0) {
        setProfileImage(images[0].url);
      }
    })
    .catch((error) => {
      // console.error(error);
      // window.location.href = "/";
    });
};
