import { SequenceNamespace } from "../SequenceNamespace";
import { relativeKey } from "../math/relativeKey";
import { modulo_12 } from "../math/modulo_12";
import { minDelta } from "../math/minDelta";
import { createPlaylist } from "../dataAcquisition/createPlaylist";

export const CoF = (initSongId) => {
  let songList = SequenceNamespace.getVar("songList"); // Mutable list of candidate songs
  const initSong = songList.find((song) => {
    return song.track_id === initSongId;
  }); // Get details based on selected song

  const NewSequence = [];
  NewSequence.push(initSong);

  songList = songList.filter((song) => {
    return song !== initSong;
  }); // Remove initSong from candidate songs

  const safeClosure = (function () {
    const songProperties = {
      nextKey: modulo_12(initSong.endkey - 7), // Resolving is equivalent to moving down 7 semitones
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
    // While not every song has been used
    let candidateSongs = [];

    candidateSongs = songList.filter((song) => {
      return (
        song.startkey === safeClosure.getVar("nextKey") &&
        song.startmode === safeClosure.getVar("nextMode")
      );
    });

    if (candidateSongs.length === 0) {
      // No keys to resolve to, find song in same key
      safeClosure.setVar(
        "nextKey",
        modulo_12(safeClosure.getVar("nextKey") + 7)
      );

      candidateSongs = songList.filter((song) => {
        return (
          song.startkey === safeClosure.getVar("nextKey") &&
          song.startmode === safeClosure.getVar("nextMode")
        );
      });

      if (candidateSongs.length === 0) {
        // No matches -> relative key
        safeClosure.setVar(
          "nextKey",
          relativeKey(
            safeClosure.getVar("nextKey"),
            safeClosure.getVar("nextMode")
          )
        );
        safeClosure.setVar("nextMode", 1 - safeClosure.getVar("nextMode"));

        candidateSongs = songList.filter((song) => {
          return (
            song.startkey === safeClosure.getVar("nextKey") &&
            song.startmode === safeClosure.getVar("nextMode")
          );
        });

        if (candidateSongs.length === 0) {
          // No relative key -> closest tempo
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

    safeClosure.setVar("nextKey", modulo_12(nextSong.endkey - 7));
    safeClosure.setVar("nextMode", nextSong.endmode);
    safeClosure.setVar("targetTempo", nextSong.endtempo);
  }

  // console.log(NewSequence);
  createPlaylist("CoF Sequenced ", NewSequence);
};
