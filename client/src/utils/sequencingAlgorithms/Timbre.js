import { SequenceNamespace } from "../SequenceNamespace";
import { SquaredEuclideanDistance } from "../math/SquaredEuclideanDistance";
import { createPlaylist } from "../accessSpotify/createPlaylist";

export const Timbre = (initSongId) => {
  let songList = SequenceNamespace.getVar("songList");

  const initSong = songList.find((song) => {
    return song.trackId === initSongId;
  });

  const NewSequence = [];
  NewSequence.push(initSong);

  songList = songList.filter((obj) => {
    return obj !== initSong;
  }); // Remove song from mutable list (it will no longer be available for mutable_song_list.find() and so it won't duplicate)

  // Safe reference to current song since its scope
  // Resides outside the loop (so that it is accessible in each iteration)
  // But it will change every iteration of the loop
  const safeClosure = (function () {
    let cur = initSong;

    return {
      getCur: function () {
        return cur;
      },
      setCur: function (next) {
        cur = next;
      },
    };
  })();

  while (songList.length !== 0) {
    let { minDist, indexClosest } = { minDist: null, indexClosest: null };

    songList.forEach((song, index) => {
      const currentDist = SquaredEuclideanDistance(
        safeClosure.getCur().endTimbreCentroid,
        song.begTimbreCentroid
      );

      // Cheeky destructuring assignment ternary operator
      ({ minDist, indexClosest } =
        minDist == null || currentDist < minDist
          ? {
              minDist: currentDist,
              indexClosest: index,
            }
          : {
              minDist: minDist,
              indexClosest: indexClosest,
            });
    });
    safeClosure.setCur(songList.splice(indexClosest, 1)[0]);
    NewSequence.push(safeClosure.getCur());
  }

  console.log(NewSequence);
  createPlaylist("Timbre Sequenced ", NewSequence);
};
