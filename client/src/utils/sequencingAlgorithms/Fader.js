import { SequenceNamespace } from "../SequenceNamespace";
import { relativeKey } from "../math/relativeKey";
import { modulo_12 } from "../math/modulo_12";
import { minDelta } from "../math/minDelta";
// import { createPlaylist } from "../accessSpotify/createPlaylist";

export const Fader = (initSongId) => {
  let songList = SequenceNamespace.getVar("songList");

  const initSong = songList.find((song) => {
    return song.trackId === initSongId;
  });

  const NewSequence = [];

  NewSequence.push(initSong);

  songList = songList.filter((obj) => {
    return obj !== initSong;
  });

  const safeClosure = (function () {
    const songProperties = {
      nextKey: initSong.endkey,
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
    let candidateSongs = songList.filter((song) => {
      return (
        song.startkey === safeClosure.getVar("nextKey") &&
        song.startmode === safeClosure.getVar("nextMode") // Find song in same key
      );
    });

    if (candidateSongs.length === 0) {
      // No matches
      safeClosure.setVar(
        "nextKey",
        relativeKey(
          safeClosure.getVar("nextKey"),
          safeClosure.getVar("nextMode")
        )
      ); // Look for relative key
      safeClosure.setVar("nextMode", 1 - safeClosure.getVar("nextMode"));

      candidateSongs = songList.filter((song) => {
        return (
          song.startkey === safeClosure.getVar("nextKey") &&
          song.startmode === safeClosure.setVar("nextMode") // Relative key
        );
      });

      if (candidateSongs.length === 0) {
        // No exact key match nor relative key
        safeClosure.setVar(
          "nextKey",
          relativeKey(
            safeClosure.getVar("nextKey"),
            safeClosure.getVar("nextMode")
          )
        ); // Go back to original ending key
        safeClosure.setVar("nextMode", 1 - safeClosure.getVar("nextMode"));
        safeClosure.setVar(
          "nextKey",
          modulo_12(safeClosure.getVar("nextKey") - 7)
        ); // Try resolving down

        candidateSongs = songList.filter((song) => {
          return (
            song.startkey === safeClosure.getVar("nextKey") &&
            song.startmode === safeClosure.getVar("nextMode") // Relative key
          );
        });

        if (candidateSongs.length === 0) {
          candidateSongs = songList;
        }
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
    }); // Remove song from mutable list

    safeClosure.setVar("nextKey", nextSong.endkey);
    safeClosure.setVar("nextMode", nextSong.endmode);
    safeClosure.setVar("targetTempo", nextSong.endtempo);
  }

  SequenceNamespace.setVar("NewSequence", NewSequence);
  return NewSequence;
};
