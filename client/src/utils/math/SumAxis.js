export const SumAxis = (vectorList, axisIndex) => {
  var axisSum = 0;
  for (let i = 0; i < vectorList.length; i++) {
    axisSum += vectorList[i][axisIndex];
  }
  return axisSum;
};
