export const SumAxis = (vectorList, axisIndex) => {
  // Sum elements along a matrix axis
  // vectorList is a collection of timbre vectors that are 12 dimensional
  // Therefore, vectorList is n x 12
  // Each column [0 through 11] is the feature for which we want the cumulative sum
  let axisSum = 0;
  for (let i = 0; i < vectorList.length; i++) {
    axisSum += vectorList[i][axisIndex];
  }
  return axisSum;
};
