export const setProfileImage = async (url) => {
  const profileAvatar = document.getElementById("profile-btn");
  const iconContainer = profileAvatar.childNodes[0];
  const icon = iconContainer.childNodes[0];
  icon.style.display = "none"; // Disable display of default avatar image

  // Create element to show fetched profile image
  const divElement = document.createElement("div");
  divElement.style.backgroundImage = `url('${url}')`;
  divElement.style.height = "32px";
  divElement.style.width = "32px";
  divElement.style.backgroundRepeat = "no-repeat";
  divElement.style.backgroundPosition = "center";
  divElement.style.borderRadius = "20px";

  iconContainer.prepend(divElement);
};
