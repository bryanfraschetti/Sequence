export const ActivateErrorNotice = () => {
  const FetchAnimation = document.getElementById("loading-container");
  FetchAnimation.style.display = "none"; // Disable loading animation
  const ErrorNotice = document.getElementById("error-notice");
  ErrorNotice.style.display = "block";
};
