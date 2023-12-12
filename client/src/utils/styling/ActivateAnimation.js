export const ActivateAnimation = () => {
  const loading_container = document.getElementById("loading-container");
  if (loading_container.style.getPropertyValue("display") === "none") {
    loading_container.style.setProperty("display", "block");
  } else {
    loading_container.style.setProperty("display", "none");
  }
};
