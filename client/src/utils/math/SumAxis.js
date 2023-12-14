export const SumAxis = (vectorList, axisIndex) => {
  let axisSum = 0;
  for (let i = 0; i < vectorList.length; i++) {
    axisSum += vectorList[i][axisIndex];
  }
  return axisSum;
};
