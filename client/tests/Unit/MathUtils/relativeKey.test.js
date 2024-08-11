import { relativeKey } from "../../../src/utils/math/relativeKey";

describe("Relative major/minor key finder", () => {
  test("Relative minors of some major keys", () => {
    expect(relativeKey(5, 1)).toBe(2);
    expect(relativeKey(2, 1)).toBe(11);
    expect(relativeKey(11, 1)).toBe(8);
  });
  test("Relative majors of some minor keys", () => {
    expect(relativeKey(5, 0)).toBe(8);
    expect(relativeKey(2, 0)).toBe(5);
    expect(relativeKey(11, 0)).toBe(2);
  });
});
