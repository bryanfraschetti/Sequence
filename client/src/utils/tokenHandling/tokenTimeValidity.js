export const tokenTimeValidity = () => {
  const date = new Date();
  const expires = localStorage.getItem("expires");
  const isExpired = date.getTime() > expires - 300 * 1000 ? true : false; //if we are within 5 minutes, consider it expired
  return isExpired;
};
