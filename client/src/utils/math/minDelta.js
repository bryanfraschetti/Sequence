export const minDelta = (list, target) => {
  var closestTempo = {
    min_delta: null,
    song: null,
  };

  for (let i = 0; i < list.length; i++) {
    const currentDifference = list[i].starttempo - target;
    closestTempo =
      closestTempo.min_delta === null ||
      Math.abs(currentDifference) < Math.abs(closestTempo.min_delta)
        ? { min_delta: currentDifference, song: list[i] }
        : closestTempo;
  }

  return closestTempo;
};
