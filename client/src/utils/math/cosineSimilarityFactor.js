export const cosineSimilarityFactor = (v1, v2) => {
  let dotProd = 0;
  let v1Mag = 0;
  let v2Mag = 0;

  for (let i = 0; i < v1.length; i++) {
    dotProd += v1[i] * v2[i];
    v1Mag += v1[i] * v1[i];
    v2Mag += v2[i] * v2[i];
  }

  const cosTheta = dotProd / (Math.sqrt(v1Mag) * Math.sqrt(v2Mag));

  return cosTheta;
};
