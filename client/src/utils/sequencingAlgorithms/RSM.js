import { SequenceNamespace } from "../SequenceNamespace";

export const RSM = (initSongId) => {
  console.log("RSM");
  const songList = SequenceNamespace.getVar("songList");
  const initSong = songList.find((song) => {
    return song.track_id === initSongId;
  });
  console.log(initSong);
};
