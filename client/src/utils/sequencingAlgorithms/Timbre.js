import { SequenceNamespace } from "../SequenceNamespace";
import { SquaredEuclideanDistance } from "../math/SquaredEuclideanDistance";
import { createPlaylist } from "../dataAcquisition/createPlaylist";

export const Timbre = (initSongId) => {
  let songList = SequenceNamespace.getVar("songList");

  const initSong = songList.find((song) => {
    return song.track_id === initSongId;
  });

  const NewSequence = [];
  NewSequence.push(initSong);

  songList = songList.filter((obj) => {
    return obj !== initSong;
  }); //remove song from mutable list (it will no longer be available for mutable_song_list.find() and so it won't duplicate)

  //safe reference to current song since its scope
  //resides outside the loop (so that it is accessible in each iteration)
  //but it will change every iteration of the loop
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
    let minDist = null;
    let indexClosest = null;
    songList.forEach((song, index) => {
      if (minDist == null) {
        minDist = SquaredEuclideanDistance(
          safeClosure.getCur().endTimbreCentroid,
          song.begTimbreCentroid
        );
        indexClosest = index;
      } else if (
        SquaredEuclideanDistance(safeClosure.getCur().endTimbreCentroid, song.begTimbreCentroid) <
        minDist
      ) {
        minDist = SquaredEuclideanDistance(
          safeClosure.getCur().endTimbreCentroid,
          song.begTimbreCentroid
        );
        indexClosest = index;
      }
    });
    safeClosure.setCur(songList.splice(indexClosest, 1)[0]);
    NewSequence.push(safeClosure.getCur());
  }

  console.log(NewSequence);
  createPlaylist("Timbre Sequenced ", NewSequence);
};
