import { addPlaylistToDom } from "../styling/addPlaylistToDom";

export const getPlaylistsCache = async () => {
  const userId = localStorage.getItem("userId");

  try {
    // Try reading playlist cache
    const response = await fetch(
      `http://127.0.0.1/api/playlists/cache/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

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
