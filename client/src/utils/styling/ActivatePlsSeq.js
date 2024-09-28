export const ActivatePlsSeq = () => {
  const FetchAnimation = document.getElementById("loading-container");
  if (FetchAnimation) {
    FetchAnimation.style.display = "none"; // Disable loading animation
  }
  const PlsSeqNotice = document.getElementById("pls-seq-notice");
  PlsSeqNotice.style.display = "block"; // Enable error status
};
