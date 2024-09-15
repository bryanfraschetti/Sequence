export const updateUserCache = async (userId, profilePicUrl, JWT) => {
  const success = await fetch("https://sequencewav.com/api/users/create", {
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
  });

  return success;
};
