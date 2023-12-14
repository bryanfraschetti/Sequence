//Frequently used functions
export const modulo_12 = (x) => {
  //For negative numbers % modulo does not behave the way in which I want
  if (x > 0) {
    return x % 12;
  } else if (x === 0) {
    //Sometimes -0 occurs, and although it might not matter, I resolve all -0 instances to 0
    // -0 === 0 is true
    return 0;
  } else {
    return 12 + x;
  }
};
