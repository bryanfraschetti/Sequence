import { SequenceNamespace } from "../SequenceNamespace";
import { modulo_12 } from "../math/modulo_12";
import { minDelta } from "../math/minDelta";
import { createPlaylist } from "../dataAcquisition/createPlaylist";

export const RSA = (initSongId) => {
  let songList = SequenceNamespace.getVar("songList");
  const initSong = songList.find((song) => {
    return song.track_id === initSongId;
  });

  const NewSequence = [];
  NewSequence.push(initSong);

  songList = songList.filter((song) => {
    return song !== initSong;
  });

  const safeClosure = (function () {
    const songProperties = {
      nextKey: modulo_12(initSong.endkey + 1), //rise by a semitone
      nextMode: 1 - initSong.endmode, //alternate mode
      targetTempo: initSong.endtempo,
    };

    return {
      getVar: function (property) {
        return songProperties[property];
      },
      setVar: function (property, value) {
        songProperties[property] = value;
      },
    };
  })();

  while (songList.length > 0) {
    let candidateSongs = songList.filter((song) => {
      return (
        song.startkey === safeClosure.getVar("nextKey") &&
        song.startmode === safeClosure.getVar("nextMode")
      );
    });

    if (candidateSongs.length === 0) {
      //keep initial modality
      safeClosure.setVar("nextMode", 1 - safeClosure.getVar("nextMode")); //get initial mode back
      candidateSongs = songList.filter((song) => {
        return (
          song.startkey === safeClosure.getVar("nextKey") &&
          song.startmode === safeClosure.getVar("nextMode")
        );
      });

      if (candidateSongs.length === 0) {
        safeClosure.setVar("nextKey", modulo_12(safeClosure.getVar("nextKey") - 1)); //initial key
        safeClosure.setVar("nextMode", 1 - safeClosure.getVar("nextMode")); //alternate mode
        candidateSongs = songList.filter((song) => {
          return (
            song.startkey === safeClosure.getVar("nextKey") &&
            song.startmode === safeClosure.getVar("nextMode")
          );
        });

        if (candidateSongs.length === 0) {
          candidateSongs = songList;
        }
      }
    }

    const closestByTempo = minDelta(candidateSongs, safeClosure.getVar("targetTempo"));
    const nextSong = closestByTempo.song;

    NewSequence.push(nextSong);
    songList = songList.filter((song) => {
      return song !== nextSong;
    });

    safeClosure.setVar("nextKey", modulo_12(nextSong.endkey + 1));
    safeClosure.setVar("nextMode", 1 - nextSong.endmode);
    safeClosure.setVar("targetTempo", nextSong.endtempo);
  }

  console.log(NewSequence);
  createPlaylist("R.S.A Sequenced ", NewSequence);
};
