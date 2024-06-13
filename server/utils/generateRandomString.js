export const generateRandomString = (length) => {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  while (text.length < length) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};
