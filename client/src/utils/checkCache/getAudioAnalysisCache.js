import { SequenceNamespace } from "../SequenceNamespace";
import { ActivateAnimation } from "../styling/ActivateAnimation";
import { updateTracksTableContent } from "../styling/updateTracksTableContents";

export const getAudioAnalysisCache = async () => {
  const userId = localStorage.getItem("userId");
  const playlistId = SequenceNamespace.getVar("playlistId");
  try {
    // Try reading playlist cache
    const response = await fetch("http://127.0.0.1/api/getAudioAnalysisCache", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        playlistId: playlistId,
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    } else {
      // Read cached data
      const data = await response.json();

      const expectedNumSongs = data.expectedNumSongs;
      const cachedTrackList = data.cachedTrackList;
      SequenceNamespace.setVar("expectedNumSongs", expectedNumSongs);
      SequenceNamespace.setVar("songList", []);

      // Keep track of whether or not this playlist was cached to avoid rewriting existing data
      SequenceNamespace.setVar("songListFromCache", true);

      updateTracksTableContent(expectedNumSongs);

      if (expectedNumSongs !== 0) {
        cachedTrackList.forEach((song) => {
          SequenceNamespace.appendArray("songList", song);
        });
      } else {
        // No songs so this event has to be fired manually
        ActivateAnimation();
      }

      return true;
    }
  } catch (err) {
    // console.error(err);
    // Failure in reading cache
    return false;
  }
};
