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
      // Read cached data
      const data = await response.json();

      // Update UI with cached data
      data.cachedPlaylists.forEach((playlist) => {
        addPlaylistToDom(playlist);
      });

      return true;
    }
  } catch (err) {
    // console.error(err);
    // Failure in reading cache
    return false;
  }
};
