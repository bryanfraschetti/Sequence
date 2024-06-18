import { SequenceNamespace } from "../SequenceNamespace";

export const getPlaylistTracksCache = async () => {
  const userId = localStorage.getItem("userId");
  const playlistId = SequenceNamespace.getVar("playlistId");
  try {
    // Try reading playlist cache
    const response = await fetch(
      `http://127.0.0.1/api/tracklist/cache/${playlistId}/${userId}`,
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

      const expectedNumSongs = data.expectedNumSongs;
      const cachedTrackList = data.cachedTrackList;

      return {
        cached: true,
        expectedNumSongs: expectedNumSongs,
        cachedTrackList: cachedTrackList,
      };
    }
  } catch (err) {
    // console.error(err);
    // Failure in reading cache
    return { cached: false, expectedNumSongs: null, cachedTrackList: null };
  }
};