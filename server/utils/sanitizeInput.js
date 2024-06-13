export const sanitizeInput = (input) => {
  if (input === null || input === undefined || Number.isInteger(input)) {
    return input;
  } else if (typeof input === "string") {
    return input.replace(/[()\[\]{}<>&^$@*#=%,;?!\\\|'"`]/g, "");
  }
};
