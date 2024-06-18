export const updateAudioAnalysisCache = async (trackInfo) => {
  await fetch(`http://127.0.0.1/api/tracks/create/${trackInfo.trackId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      trackInfo: trackInfo,
    }),
  })
    .then((response) => {
      //   console.log(response);
    })
    .catch((error) => {
      //   console.error(error);
    });
};
