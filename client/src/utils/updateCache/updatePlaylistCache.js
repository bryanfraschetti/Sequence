export const updatePlaylistCache = async (playlists) => {
  // Send fetched playlists to Sequence
  const userId = localStorage.getItem("userId");
  const JWT = localStorage.getItem("JWT");

  fetch(`/api/playlists/update/${userId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${JWT}`,
    },
    body: JSON.stringify({
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
