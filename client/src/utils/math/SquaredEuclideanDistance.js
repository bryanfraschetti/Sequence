export const SquaredEuclideanDistance = (v1, v2) => {
  let sumSquaredDifferences = 0;

  for (let i = 0; i < v1.length; i++) {
    const difference = v1[i] - v2[i];
    sumSquaredDifferences += difference * difference;
  }

  return sumSquaredDifferences;
};
