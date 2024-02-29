import { getPlaylistsCache } from "../checkCache/getPlaylistsCache";
import { getPlaylistsSpotify } from "../accessSpotify/getPlaylistsSpotify";
import { updatePlaylistCache } from "../updateCache/updatePlaylistCache";
import { SequenceNamespace } from "../SequenceNamespace";

export const getPlaylists = async () => {
  try {
    // Try to get cache
    const cached = await getPlaylistsCache();

    if (!cached) {
      // Failure to find cached data
      // Reach spotify
      await getPlaylistsSpotify();

      // Update playlist cache
      await updatePlaylistCache(SequenceNamespace.getVar("playlistList"));
    }
  } catch (err) {
    // console.error(err);
  }
};
