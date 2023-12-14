import { SequenceNamespace } from "../SequenceNamespace";

export const DSM = (initSongId) => {
  console.log("DSM");
  const songList = SequenceNamespace.getVar("songList");
  const initSong = songList.find((song) => {
    return song.track_id === initSongId;
  });
  console.log(initSong);
};
