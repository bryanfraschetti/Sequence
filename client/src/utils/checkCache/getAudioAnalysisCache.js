export const getAudioAnalysisCache = async (trackId) => {
  // getAudio cache
  return fetch(`/api/tracks/cache/${trackId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      //   console.log(response);
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response);
      }
    })
    .then((data) => {
      //   console.log(data);
      return data;
    })
    .catch((err) => {
      //   console.error(err);
    });
};
