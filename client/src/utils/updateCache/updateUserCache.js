export const updateUserCache = async (userId, profilePicUrl) => {
  await fetch("/createUserCache", {
    // Cache Image (or the lack thereof)
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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
