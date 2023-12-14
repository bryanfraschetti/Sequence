import { SequenceNamespace } from "../SequenceNamespace";
import { relativeKey } from "../math/relativeKey";
import { modulo_12 } from "../math/modulo_12";
import { minDelta } from "../math/minDelta";

export const Fader = (initSongId) => {
  console.log("Fader");

  let songList = SequenceNamespace.getVar("songList");

  const initSong = songList.find((song) => {
    return song.track_id === initSongId;
  });

  console.log(initSong);
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
        song.startmode === safeClosure.getVar("nextMode") //find song in same key
      );
    });

    if (candidateSongs.length === 0) {
      //no matches
      safeClosure.setVar(
        "nextKey",
        relativeKey(safeClosure.getVar("nextKey"), safeClosure.getVar("nextMode"))
      ); //look for relative key
      safeClosure.setVar("nextMode", 1 - safeClosure.getVar("nextMode"));

      candidateSongs = songList.filter((song) => {
        return (
          song.startkey === safeClosure.getVar("nextKey") &&
          song.startmode === safeClosure.setVar("nextMode") //relative key
        );
      });

      if (candidateSongs.length === 0) {
        //no exact key match nor relative key
        safeClosure.setVar(
          "nextKey",
          relativeKey(safeClosure.getVar("nextKey"), safeClosure.getVar("nextMode"))
        ); //go back to original ending key
        safeClosure.setVar("nextMode", 1 - safeClosure.getVar("nextMode"));
        safeClosure.setVar("nextKey", modulo_12(safeClosure.getVar("nextKey") - 7)); //try resolving down

        candidateSongs = songList.filter((song) => {
          return (
            song.startkey === safeClosure.getVar("nextKey") &&
            song.startmode === safeClosure.getVar("nextMode") //relative key
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
    }); //remove song from mutable list

    safeClosure.setVar("nextKey", nextSong.endkey);
    safeClosure.setVar("nextMode", nextSong.endmode);
    safeClosure.setVar("targetTempo", nextSong.endtempo);
  }

  console.log(NewSequence);
  // createPlaylist("Fader Sequenced ", NewSequence);
};
