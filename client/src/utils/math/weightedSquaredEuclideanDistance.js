export const weightedSquaredEuclideanDistance = (v1, v2) => {
  // Squared elementwise vector difference: ||(v1-v2)||.^2

  // Eigenvalues from my independent audioAnalysis trained on MUSDB
  // [
  //    0.24401555 0.11914532 0.04135375
  //    0.02156782 0.01975057 0.01711451
  //    0.01034643 0.00773633 0.00636239
  //    0.00594777 0.00573273
  // ]
  // There are only 11 dimensions since the first one Spotify provides is loudness
  // So there are only 11 effective "sound" bases reported by Spotify

  let sumSquaredDifferences = 0;
  const Eigenvalues = [
    0.24401555, 0.11914532, 0.04135375, 0.02156782, 0.01975057, 0.01711451,
    0.01034643, 0.00773633, 0.00636239, 0.00594777, 0.00573273,
  ];

  for (let i = 0; i < v1.length; i++) {
    const difference = v1[i] - v2[i];
    sumSquaredDifferences += difference * difference * Eigenvalues[i];
  }

  return sumSquaredDifferences;
};
