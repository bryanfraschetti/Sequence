export const toggleSidebar = () => {
  document.getElementById("sidebar").classList.toggle("inactive");
  document.getElementById("tracks").classList.toggle("inactive");
  document.getElementById("hamburger-container").classList.toggle("active");
};
