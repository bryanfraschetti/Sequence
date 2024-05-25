import { SequenceNamespace } from "../SequenceNamespace";

export const updateAudioAnalysisCache = async () => {
  // Send fetched song information to Sequence
  const userId = localStorage.getItem("userId");
  const selectedPlaylist = SequenceNamespace.getVar("playlistId");
  const songs = SequenceNamespace.getVar("songList");
  const expectedNumSongs = SequenceNamespace.getVar("expectedNumSongs");

  await fetch("/api/updateAudioAnalysisCache", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: userId,
      playlistId: selectedPlaylist,
      songList: songs,
      expectedNumSongs: expectedNumSongs,
    }),
  })
    .then((response) => {
      //   console.log(response);
    })
    .catch((error) => {
      //   console.error(error);
    });
};
