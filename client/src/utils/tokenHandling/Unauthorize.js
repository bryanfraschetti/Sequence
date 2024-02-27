export const Unauthorize = () => {
  const userId = localStorage.getItem("userId");
  fetch("/Unauthorize", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: userId,
    }),
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
  const entry_point = "/";
  Object.keys(localStorage).forEach((el) => {
    localStorage.removeItem(el);
  });
  window.location.href = entry_point;
};
