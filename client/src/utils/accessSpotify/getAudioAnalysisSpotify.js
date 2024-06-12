import { tokenTimeValidity } from "../tokenHandling/tokenTimeValidity";
import { refreshTokens } from "../tokenHandling/refreshTokens";
import { SumAxis } from "../math/SumAxis";
import { SequenceNamespace } from "../SequenceNamespace";
import { updateAudioAnalysisCache } from "../updateCache/updateAudioAnalysisCache";

export const getAudioAnalysisSpotify = async (trackInfo) => {
  const access_token = localStorage.getItem("access_token");
  const tokensExpired = tokenTimeValidity();
  console.log("Getting Audio Analysis Spotify");
  if (tokensExpired) {
    await refreshTokens();
  }

  const trackId = trackInfo.trackId;
  const trackName = trackInfo.name;
  const albumArtSrc = trackInfo.albumArtSrc;
  const artist = trackInfo.artist;

  fetch(`https://api.spotify.com/v1/audio-analysis/${trackId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: " Bearer " + access_token,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response);
      }
    })
    .then(async (data) => {
      const trackDuration = data.track.duration;
      const trackEnding = trackDuration - 12;

      const beginningSegments = [];
      data.segments.every((el) => {
        if (el.start <= 12) {
          beginningSegments.push(el.timbre);
          return true;
        } else {
          return false;
        }
      });

      const begTimbreCentroid = [];
      //axis may also be thought of as dimension in the featurespace
      for (let timbIt = 0; timbIt < 12; timbIt++) {
        const axisSum = SumAxis(beginningSegments, timbIt);
        const axisAvg = axisSum / beginningSegments.length;
        begTimbreCentroid.push(axisAvg);
      }

      const endingSegments = [];
      const reverse = data.segments.reverse();
      reverse.every((el) => {
        if (el.start >= trackEnding) {
          endingSegments.push(el.timbre);
          return true;
        } else {
          return false;
        }
      });

      const endTimbreCentroid = [];
      for (let timbIt = 0; timbIt < 12; timbIt++) {
        const axisSum = SumAxis(endingSegments, timbIt);
        const axisAvg = axisSum / endingSegments.length;
        endTimbreCentroid.push(axisAvg);
      }

      const songInfo = {
        name: trackName,
        trackId: trackId,
        albumArtSrc: albumArtSrc,
        artist: artist,

        startkey: data.sections[0].key,
        startmode: data.sections[0].mode,
        starttempo: data.sections[0].tempo,

        key: data.track.key,
        mode: data.track.mode,
        tempo: data.track.tempo,

        endkey: data.sections[data.sections.length - 1].key,
        endmode: data.sections[data.sections.length - 1].mode,
        endtempo: data.sections[data.sections.length - 1].tempo,

        // beginningTimbres: beginningSegments,
        // endingTimbre: endingSegments,

        begTimbreCentroid: begTimbreCentroid,
        endTimbreCentroid: endTimbreCentroid,
      };

      await updateAudioAnalysisCache(songInfo);
      SequenceNamespace.appendArray("songList", songInfo);
    })
    .catch((error) => {
      // console.error(error);
    });
};
