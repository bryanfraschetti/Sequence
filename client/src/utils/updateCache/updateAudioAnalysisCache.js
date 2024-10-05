import { SequenceNamespace } from "../SequenceNamespace";

export const updateAudioAnalysisCache = async (trackInfo) => {
  const sequenceUrl = SequenceNamespace.getVar("sequenceUrl");

  await fetch(`${sequenceUrl}/api/tracks/create/${trackInfo.trackId}`, {
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
