export const Unauthorize = () => {
  const userId = localStorage.getItem("userId"); // Post userId to Sequence endpoint
  fetch("http://127.0.0.1/api/Unauthorize", {
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
        // Session and cache destroyed
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
      //   console.error(error);
    });

  // Clear local storage credentials
  Object.keys(localStorage).forEach((el) => {
    localStorage.removeItem(el);
  });

  // User is no longer logged in, redirect them back to home page
  const entry_point = "/";
  window.location.href = entry_point;
};
