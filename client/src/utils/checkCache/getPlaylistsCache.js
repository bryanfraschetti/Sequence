import { addPlaylistToDom } from "../styling/addPlaylistToDom";

export const getPlaylistsCache = async () => {
  const userId = localStorage.getItem("userId");

  try {
    // Try reading playlist cache
    const response = await fetch("/getPlaylistCache", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    } else {
      // console.log("RESPONSE playlist:", response);
      // console.log("RESPONSE.json() playlist:", response.json);

      // Read cached data
      const data = await response.json();
      //   console.log(data);
      data.cachedPlaylists.forEach((playlist) => {
        addPlaylistToDom(playlist); // Update UI with cached data
      });

      return true;
    }
  } catch (err) {
    // console.log(err);
    // Failure in reading cache
    return false;
  }
};
