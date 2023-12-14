import { SequenceNamespace } from "../SequenceNamespace";
import { relativeKey } from "../math/relativeKey";
import { modulo_12 } from "../math/modulo_12";
import { minDelta } from "../math/minDelta";
import { createPlaylist } from "../dataAcquisition/createPlaylist";

export const CoF = (initSongId) => {
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
      nextKey: modulo_12(initSong.endkey - 7), //resolving is equivalent to moving down 7 semitones
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
      //no keys to resolve to, find song in same key
      safeClosure.setVar("nextKey", modulo_12(safeClosure.getVar("nextKey") + 7));

      candidateSongs = songList.filter((song) => {
        return (
          song.startkey === safeClosure.getVar("nextKey") &&
          song.startmode === safeClosure.getVar("nextMode")
        );
      });

      if (candidateSongs.length === 0) {
        //no matches -> relative key
        safeClosure.setVar(
          "nextKey",
          relativeKey(safeClosure.getVar("nextKey"), safeClosure.getVar("nextMode"))
        );
        safeClosure.setVar("nextMode", 1 - safeClosure.getVar("nextMode"));

        candidateSongs = songList.filter((song) => {
          return (
            song.startkey === safeClosure.getVar("nextKey") &&
            song.startmode === safeClosure.getVar("nextMode")
          );
        });

        if (candidateSongs.length === 0) {
          //no relative key -> closest tempo
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

    safeClosure.setVar("nextKey", modulo_12(nextSong.endkey - 7));
    safeClosure.setVar("nextMode", nextSong.endmode);
    safeClosure.setVar("targetTempo", nextSong.endtempo);
  }

  //see https://developer.spotify.com/documentation/web-api/reference/#/operations/create-playlist for information on body parameters
  console.log(NewSequence);
  createPlaylist("CoF Sequenced ", NewSequence);
};
