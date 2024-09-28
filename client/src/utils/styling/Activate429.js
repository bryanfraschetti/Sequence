export const Activate429 = (ERR) => {
  // console.log(ERR);
  const FetchAnimation = document.getElementById("loading-container");
  if (FetchAnimation) {
    FetchAnimation.style.display = "none"; // Disable loading animation
  }
  const ErrorNotice = document.getElementById("error-429");
  ErrorNotice.style.display = "block"; // Enable error status
};
