import { SequenceNamespace } from "../SequenceNamespace";
import { cosineSimilarityFactor } from "../math/cosineSimilarityFactor";

export const AngularSort = (initSongId) => {
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
    let { cosTheta, indexClosest } = { minDist: null, indexClosest: null };

    songList.forEach((song, index) => {
      // Squared Euclidean distance of cluster centroids
      // excluding dimension representing loudness
      const current = safeClosure.getCur();
      const currentClone = JSON.parse(
        JSON.stringify(current.endTimbreCentroid)
      );
      currentClone.push(current.endtempo);
      const endVector = currentClone.slice(1, 13);

      const candidateClone = JSON.parse(JSON.stringify(song.begTimbreCentroid));
      candidateClone.push(song.starttempo);
      const candidateStartVector = candidateClone.slice(1, 13);

      const currentAngularSimilarity = cosineSimilarityFactor(
        endVector,
        candidateStartVector
      );

      // Cheeky destructuring assignment ternary operator
      ({ cosTheta, indexClosest } =
        cosTheta == null || currentAngularSimilarity > cosTheta
          ? {
              cosTheta: currentAngularSimilarity,
              indexClosest: index,
            }
          : {
              cosTheta: cosTheta,
              indexClosest: indexClosest,
            });
    });
    safeClosure.setCur(songList.splice(indexClosest, 1)[0]);
    NewSequence.push(safeClosure.getCur());
  }

  SequenceNamespace.setVar("NewSequence", NewSequence);
  return NewSequence;
};
