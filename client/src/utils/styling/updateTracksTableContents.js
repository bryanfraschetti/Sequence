import { InitializeTrackTable } from "./InitializeTrackTable";

export const updateTracksTableContent = (numSongs) => {
  const EmptyStateContainer = document.getElementById("EmptyStateContainer");
  if (numSongs === 0) {
    // If no songs, display empty state art
    EmptyStateContainer.style.display = "block";
    EmptyStateContainer.children[1].innerHTML =
      "This playlist does not appear to have any songs :( Try adding some and coming back later";
  } else {
    EmptyStateContainer.style.display = "none"; // If songs, don't show empty state
    InitializeTrackTable();
  }
};
