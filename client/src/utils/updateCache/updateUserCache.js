export const updateUserCache = async (userId, profilePicUrl, JWT) => {
  fetch("/api/users/create", {
    // Cache Image (or the lack thereof)
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${JWT}`,
    },
    body: JSON.stringify({
      userId: userId,
      profilePicUrl: profilePicUrl,
    }),
  })
    .then((response) => {
      //   console.log(response);
    })
    .catch((err) => {
      //   console.error(err);
    });
};
