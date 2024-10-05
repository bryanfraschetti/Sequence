import { SequenceNamespace } from "../SequenceNamespace";

export const updatePlaylistTracklistCache = async (filteredTracks) => {
  // Send fetched song information to Sequence
  const sequenceUrl = SequenceNamespace.getVar("sequenceUrl");
  const userId = localStorage.getItem("userId");
  const JWT = localStorage.getItem("JWT");
  const selectedPlaylist = SequenceNamespace.getVar("playlistId");
  const expectedNumSongs = SequenceNamespace.getVar("expectedNumSongs");
  const trackIdList = [];
  filteredTracks.forEach((trackInfo) => {
    // Reduce JSON response to necessary fields
    trackIdList.push({
      trackId: trackInfo.track.id,
      name: trackInfo.track.name,
      albumArtSrc: trackInfo.track.album.images[0].url,
      artist: trackInfo.track.artists[0].name,
    });
  });
  await fetch(
    `${sequenceUrl}/api/tracklist/update/${selectedPlaylist}/${userId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JWT}`,
      },
      body: JSON.stringify({
        songList: trackIdList,
        expectedNumSongs: expectedNumSongs,
      }),
    }
  )
    .then((response) => {
      //   return response;
      //   console.log(response);
    })
    .catch((error) => {
      //   console.error(error);
    });
};
