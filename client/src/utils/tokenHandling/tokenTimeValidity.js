export const tokenTimeValidity = () => {
  const date = new Date(); // Current time
  const expires = localStorage.getItem("expires"); // Expiry time for tokens
  const isExpired = date.getTime() > expires - 300 * 1000 ? true : false; // If we are within 5 minutes, consider it expired
  return isExpired;
};
