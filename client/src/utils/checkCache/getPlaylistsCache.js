import { addPlaylistToDom } from "../styling/addPlaylistToDom";
import { SequenceNamespace } from "../SequenceNamespace";

export const getPlaylistsCache = async () => {
  const userId = localStorage.getItem("userId");
  const JWT = localStorage.getItem("JWT");
  const sequenceUrl = SequenceNamespace.getVar("sequenceUrl");

  try {
    // Try reading playlist cache
    const response = await fetch(
      `${sequenceUrl}/api/playlists/cache/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JWT}`,
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
