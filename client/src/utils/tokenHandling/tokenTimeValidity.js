export const tokenTimeValidity = () => {
  const date = new Date(); // Current time
  const expires = localStorage.getItem("expires"); // Expiry time for tokens
  // If we are within 5 minutes, consider it expired
  const isExpired = date.getTime() > expires - 300 * 1000 ? true : false;
  return isExpired;
};
