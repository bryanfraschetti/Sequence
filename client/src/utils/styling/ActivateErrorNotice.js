export const ActivateErrorNotice = (ERR) => {
  // console.log(ERR);
  const FetchAnimation = document.getElementById("loading-container");
  if (FetchAnimation) {
    FetchAnimation.style.display = "none"; // Disable loading animation
  }
  const ErrorNotice = document.getElementById("error-notice");
  ErrorNotice.style.display = "block"; // Enable error status
};
