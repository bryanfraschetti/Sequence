import { modulo_12 } from "./modulo_12";

export const relativeKey = (key, mode) => {
  if (mode === 1) {
    //if the key we could not find was major, prep to check for relative minor
    key = modulo_12(key - 3);
  } else {
    //otherwise prep to check for relative major
    key = modulo_12(key + 3);
  }
  return key;
};
