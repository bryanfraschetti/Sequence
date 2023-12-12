export const toggleSidebar = () => {
  document.getElementById("sidebar").classList.toggle("inactive");
  document.getElementById("tracks").classList.toggle("inactive");
  document.getElementById("sidebarCollapse").classList.toggle("active");
  document.getElementById("left-arrow").classList.toggle("active");
  document.getElementById("right-arrow").classList.toggle("active");
};
