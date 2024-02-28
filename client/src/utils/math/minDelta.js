export const minDelta = (list, target) => {
  let closestTempo = {
    // Stores best match
    min_delta: null,
    song: null,
  };

  for (let i = 0; i < list.length; i++) {
    const currentDifference = list[i].starttempo - target;
    // If closest difference is not defined
    // Or if the current difference is less than stored best match
    // Update the best match
    // Otherwise no change
    closestTempo =
      closestTempo.min_delta === null ||
      Math.abs(currentDifference) < Math.abs(closestTempo.min_delta)
        ? { min_delta: currentDifference, song: list[i] }
        : closestTempo;
  }

  return closestTempo;
};
