import { SequenceNamespace } from "../SequenceNamespace";
import { modulo_12 } from "../math/modulo_12";
import { minDelta } from "../math/minDelta";

// Semitone modal (change by semitone, keep modality)
export const SM = (initSongId, semitoneDirection) => {
  let songList = SequenceNamespace.getVar("songList");
  const initSong = songList.find((song) => {
    return song.trackId === initSongId;
  });

  const NewSequence = [];
  NewSequence.push(initSong);

  songList = songList.filter((song) => {
    return song !== initSong;
  });

  const safeClosure = (function () {
    const songProperties = {
      nextKey: modulo_12(initSong.endkey + semitoneDirection),
      nextMode: initSong.endmode,
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
    let candidateSongs = [];

    candidateSongs = songList.filter((song) => {
      return (
        song.startkey === safeClosure.getVar("nextKey") &&
        song.startmode === safeClosure.getVar("nextMode")
      );
    });

    if (candidateSongs.length === 0) {
      safeClosure.setVar("nextMode", 1 - safeClosure.getVar("nextMode")); // Toggle mode
      candidateSongs = songList.filter((song) => {
        return (
          song.startkey === safeClosure.getVar("nextKey") &&
          song.startmode === safeClosure.getVar("nextMode")
        );
      });

      // if (candidateSongs.length == 0) {
      //   next_key = modulo_12(initSong.endkey - 7); //resolve
      //   next_mode = 1 - next_mode; //reverse back to original mode
      //   candidateSongs = songList.filter((obj) => {
      //     return (
      //       obj.startkey === next_key && obj.startmode === next_mode //find song in key above
      //     );
      //   });

      if (candidateSongs.length === 0) {
        candidateSongs = songList;
      }
    }
    const closestByTempo = minDelta(
      candidateSongs,
      safeClosure.getVar("targetTempo")
    );

    const nextSong = closestByTempo.song;

    NewSequence.push(nextSong);
    songList = songList.filter((song) => {
      return song !== nextSong;
    }); // Remove song from mutable list (it will no longer be available for songList.find() and so it won't duplicate)

    safeClosure.setVar(
      "nextKey",
      modulo_12(nextSong.endkey + semitoneDirection)
    ); // Set up key for next round
    safeClosure.setVar("nextMode", nextSong.endmode);
    safeClosure.setVar("targetTempo", nextSong.endtempo);
  }

  SequenceNamespace.setVar("NewSequence", NewSequence);
  return NewSequence;
};
