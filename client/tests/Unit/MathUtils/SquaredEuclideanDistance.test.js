import { SquaredEuclideanDistance } from "../../../src/utils/math/SquaredEuclideanDistance";

describe("SquaredEuclideanDistance", () => {
  describe("When vectors are positive", () => {
    test("Should correctly calculate squared Euclidean distance", () => {
      const v1 = [1, 2, 3];
      const v2 = [4, 5, 6];
      const expected = (1 - 4) ** 2 + (2 - 5) ** 2 + (3 - 6) ** 2; // 9 + 9 + 9 = 27

      const result = SquaredEuclideanDistance(v1, v2);

      expect(result).toBe(expected);
    });
  });

  describe("When vectors have negative values", () => {
    test("Should correctly calculate squared Euclidean distance", () => {
      const v1 = [-1, -2, -3];
      const v2 = [-4, -5, -6];
      const expected = (-1 - -4) ** 2 + (-2 - -5) ** 2 + (-3 - -6) ** 2; // 9 + 9 + 9 = 27

      const result = SquaredEuclideanDistance(v1, v2);

      expect(result).toBe(expected);
    });
  });

  describe("When vectors have mixed positive and negative values", () => {
    test("Should correctly calculate squared Euclidean distance", () => {
      const v1 = [1, -2, 3];
      const v2 = [-4, 5, -6];
      const expected = (1 - -4) ** 2 + (-2 - 5) ** 2 + (3 - -6) ** 2; // 25 + 49 + 81 = 155

      const result = SquaredEuclideanDistance(v1, v2);

      expect(result).toBe(expected);
    });
  });

  describe("When vectors are empty", () => {
    test("Should return 0", () => {
      const v1 = [];
      const v2 = [];
      const expected = 0;

      const result = SquaredEuclideanDistance(v1, v2);

      expect(result).toBe(expected);
    });
  });
});
