import { modulo_12 } from "../../../src/utils/math/modulo_12";

describe("modulo_12 function", () => {
  test("returns 0 for 0 input", () => {
    expect(modulo_12(0)).toBe(0);
  });

  test("returns the same number for positive numbers less than 12", () => {
    expect(modulo_12(5)).toBe(5);
    expect(modulo_12(11)).toBe(11);
  });

  test("returns the remainder for positive numbers greater than 12", () => {
    expect(modulo_12(13)).toBe(1);
    expect(modulo_12(18)).toBe(6);
    expect(modulo_12(25)).toBe(1);
  });

  test("handles negative numbers correctly", () => {
    expect(modulo_12(-1)).toBe(11);
    expect(modulo_12(-12)).toBe(0);
  });

  test("handles negative zero correctly", () => {
    expect(modulo_12(-0)).toBe(0);
  });
});
