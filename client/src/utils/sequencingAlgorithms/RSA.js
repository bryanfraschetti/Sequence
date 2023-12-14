import { SequenceNamespace } from "../SequenceNamespace";

export const RSA = (initSongId) => {
  console.log("RSA");
  const songList = SequenceNamespace.getVar("songList");
  const initSong = songList.find((song) => {
    return song.track_id === initSongId;
  });
  console.log(initSong);
};
