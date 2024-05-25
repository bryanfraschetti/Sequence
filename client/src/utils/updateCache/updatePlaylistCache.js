export const updatePlaylistCache = async (playlists) => {
  // Send fetched playlists to Sequence
  const userId = localStorage.getItem("userId");
  fetch("http://127.0.0.1/api/updatePlaylistCache", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: userId,
      playlistList: playlists,
    }),
  })
    .then((response) => {
      //   console.log(response);
    })
    .catch((error) => {
      //   console.error(error);
    });
};
