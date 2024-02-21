export const Unauthorize = () => {
  const entry_point = "/";
  Object.keys(localStorage).forEach((el) => {
    localStorage.removeItem(el);
  });

  fetch("/Unauthorize", {
    method: "GET",
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Response not OK");
      }
    })
    .then((data) => {
      if (!data.destroyed) {
        throw new Error("Failed to unauthorize");
      }
    })
    .catch((error) => {
      console.error(error);
    });

  window.location.href = entry_point;
};
