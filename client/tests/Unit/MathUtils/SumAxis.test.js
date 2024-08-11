import { SumAxis } from "../../../src/utils/math/SumAxis";

describe("SumAxis", () => {
  describe("when summing elements along a specified axis", () => {
    test("should correctly sum values for a given axis index", () => {
      // Arrange
      const vectorList = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ];
      const axisIndex = 1; // Sum values along the second axis (index 1)
      const expected = 2 + 5 + 8; // Expected sum for axis index 1

      // Act
      const result = SumAxis(vectorList, axisIndex);

      // Assert
      expect(result).toBe(expected);
    });

    test("should correctly sum values for a different axis index", () => {
      // Arrange
      const vectorList = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ];
      const axisIndex = 2; // Sum values along the third axis (index 2)
      const expected = 3 + 6 + 9; // Expected sum for axis index 2

      // Act
      const result = SumAxis(vectorList, axisIndex);

      // Assert
      expect(result).toBe(expected);
    });

    test("should handle a case with an empty vector list", () => {
      // Arrange
      const vectorList = [];
      const axisIndex = 1; // Axis index to sum along
      const expected = 0; // Sum for an empty vector list

      // Act
      const result = SumAxis(vectorList, axisIndex);

      // Assert
      expect(result).toBe(expected);
    });
  });
});
