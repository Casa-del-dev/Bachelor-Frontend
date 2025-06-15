export default function getDefaultTestCode(problemId: string): string {
  switch (problemId) {
    case "Problem 1":
      return `import unittest

class RomanToIntTests(unittest.TestCase):
    def test_example_cases(self):
        self.assertEqual(romanToInt("III"), 3)
        self.assertEqual(romanToInt("LVIII"), 58)
        self.assertEqual(romanToInt("MCMXCIV"), 1994)

    def test_basic_numerals(self):
        self.assertEqual(romanToInt("I"), 1)
        self.assertEqual(romanToInt("V"), 5)
        self.assertEqual(romanToInt("X"), 10)
        self.assertEqual(romanToInt("L"), 50)
        self.assertEqual(romanToInt("C"), 100)
        self.assertEqual(romanToInt("D"), 500)
        self.assertEqual(romanToInt("M"), 1000)

    def test_subtractive_combinations(self):
        self.assertEqual(romanToInt("IV"), 4)
        self.assertEqual(romanToInt("IX"), 9)
        self.assertEqual(romanToInt("XL"), 40)
        self.assertEqual(romanToInt("XC"), 90)
        self.assertEqual(romanToInt("CD"), 400)
        self.assertEqual(romanToInt("CM"), 900)

    def test_mixed_examples(self):
        self.assertEqual(romanToInt("XXVII"), 27)    # 10+10+5+1+1
        self.assertEqual(romanToInt("XCIX"), 99)     # 90+9
        self.assertEqual(romanToInt("CDXLIV"), 444)  # 400+40+4
        self.assertEqual(romanToInt("MMXXV"), 2025)  # 1000+1000+10+10+5

    def test_edge_cases(self):
        self.assertEqual(romanToInt("MMMCMXCIX"), 3999)  # highest standard
        self.assertEqual(romanToInt("XLIX"), 49)         # 40+9
        self.assertEqual(romanToInt("DCCC"), 800)        # 500+300
        self.assertEqual(romanToInt("CMXC"), 990)        # 900+90

if __name__ == "__main__":
    unittest.main()`;

    case "Problem 2":
      return `import unittest

class SearchInsertTests(unittest.TestCase):
    def test_example_cases(self):
        self.assertEqual(searchInsert([1, 3, 5, 6], 5), 2)
        self.assertEqual(searchInsert([1, 3, 5, 6], 2), 1)
        self.assertEqual(searchInsert([1, 3, 5, 6], 7), 4)

    def test_edge_smaller_and_larger(self):
        self.assertEqual(searchInsert([10, 20, 30], 5), 0)
        self.assertEqual(searchInsert([10, 20, 30], 40), 3)

    def test_insert_in_middle(self):
        self.assertEqual(searchInsert([1, 4, 6, 8], 5), 2)

    def test_single_element_array(self):
        self.assertEqual(searchInsert([10], 10), 0)
        self.assertEqual(searchInsert([10], 5), 0)
        self.assertEqual(searchInsert([10], 15), 1)

    def test_continuous_values(self):
        self.assertEqual(searchInsert([1, 2, 3, 4, 5], 3), 2)
        self.assertEqual(searchInsert([1, 2, 3, 4, 5], 0), 0)
        self.assertEqual(searchInsert([1, 2, 3, 4, 5], 6), 5)

if __name__ == "__main__":
    unittest.main()`;

    case "Problem 3":
      return `import unittest

class PlusOneTests(unittest.TestCase):
    def test_example_cases(self):
        self.assertEqual(plusOne([1, 2, 3]), [1, 2, 4])
        self.assertEqual(plusOne([4, 3, 2, 1]), [4, 3, 2, 2])
        self.assertEqual(plusOne([9]), [1, 0])

    def test_carry_over_multiple_digits(self):
        self.assertEqual(plusOne([9, 9]), [1, 0, 0])
        self.assertEqual(plusOne([2, 9, 9]), [3, 0, 0])
        self.assertEqual(plusOne([1, 9, 9, 9]), [2, 0, 0, 0])

    def test_no_carry_needed(self):
        self.assertEqual(plusOne([0]), [1])
        self.assertEqual(plusOne([7, 8, 9]), [7, 9, 0])

    def test_all_nines(self):
        self.assertEqual(plusOne([9, 9, 9, 9]), [1, 0, 0, 0, 0])

if __name__ == "__main__":
    unittest.main()`;

    case "Problem 4":
      return `import unittest

class ClimbStairsTests(unittest.TestCase):
    def test_example_cases(self):
        self.assertEqual(climbStairs(2), 2)
        self.assertEqual(climbStairs(3), 3)

    def test_basic_cases(self):
        self.assertEqual(climbStairs(1), 1)
        self.assertEqual(climbStairs(4), 5)
        self.assertEqual(climbStairs(5), 8)

    def test_larger_values(self):
        self.assertEqual(climbStairs(10), 89)
        self.assertEqual(climbStairs(20), 10946)

    def test_edge_minimum(self):
        self.assertEqual(climbStairs(0), 1)  # base case

if __name__ == "__main__":
    unittest.main()`;

    case "Problem 5":
      return `import unittest
from Solution import maxProfit

class MaxProfitTests(unittest.TestCase):
    def test_example_cases(self):
        self.assertEqual(maxProfit([7, 1, 5, 3, 6, 4]), 5)
        self.assertEqual(maxProfit([7, 6, 4, 3, 1]), 0)

    def test_constant_prices(self):
        self.assertEqual(maxProfit([5, 5, 5, 5]), 0)

    def test_increasing_prices(self):
        self.assertEqual(maxProfit([1, 2, 3, 4, 5]), 4)

    def test_decreasing_then_increasing(self):
        self.assertEqual(maxProfit([9, 2, 7, 1, 8]), 7)

    def test_two_day_prices(self):
        self.assertEqual(maxProfit([1, 2]), 1)
        self.assertEqual(maxProfit([2, 1]), 0)

    def test_large_profit_later(self):
        self.assertEqual(maxProfit([3, 8, 1, 10]), 9)

    def test_local_peaks(self):
        self.assertEqual(maxProfit([2, 4, 1, 5]), 4)

if __name__ == "__main__":
    unittest.main()`;

    case "Problem 6":
      return `import unittest

class CountBitsTests(unittest.TestCase):
    def test_example_cases(self):
        self.assertEqual(countBits(2), [0, 1, 1])
        self.assertEqual(countBits(5), [0, 1, 1, 2, 1, 2])

    def test_edge_zero(self):
        self.assertEqual(countBits(0), [0])

    def test_larger_number(self):
        self.assertEqual(countBits(10), [0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2])

    def test_powers_of_two(self):
        self.assertEqual(countBits(8), [0, 1, 1, 2, 1, 2, 2, 3, 1])

    def test_known_patterns(self):
        self.assertEqual(
            countBits(15),
            [0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4],
        )

if __name__ == "__main__":
    unittest.main()`;

    case "Problem 7":
      return `import unittest

class IsSubsequenceTests(unittest.TestCase):
    def test_example_cases(self):
        self.assertTrue(isSubsequence("abc", "ahbgdc"))
        self.assertFalse(isSubsequence("axc", "ahbgdc"))

    def test_empty_and_full_matches(self):
        self.assertTrue(isSubsequence("", "ahbgdc"))
        self.assertFalse(isSubsequence("abc", ""))
        self.assertTrue(isSubsequence("", ""))

    def test_exact_match(self):
        self.assertTrue(isSubsequence("ahbgdc", "ahbgdc"))

    def test_single_character(self):
        self.assertTrue(isSubsequence("a", "a"))
        self.assertFalse(isSubsequence("a", "b"))

    def test_wrong_order(self):
        self.assertFalse(isSubsequence("ba", "ahbgdc"))

    def test_long_subsequence(self):
        self.assertTrue(isSubsequence("abc", "aabbcc"))

if __name__ == "__main__":
    unittest.main()`;

    case "Problem 8":
      return `import unittest

class LargestDivisibleSubsetTests(unittest.TestCase):
    def is_valid_subset(self, subset):
        for i in range(len(subset)):
            for j in range(i + 1, len(subset)):
                a, b = subset[i], subset[j]
                if a % b != 0 and b % a != 0:
                    return False
        return True

    def test_example_cases(self):
        result1 = largestDivisibleSubset([1, 2, 3])
        self.assertTrue(set(result1) in [set([1, 2]), set([1, 3])])
        self.assertTrue(self.is_valid_subset(result1))

        result2 = largestDivisibleSubset([1, 2, 4, 8])
        self.assertTrue(result2 == [1, 2, 4, 8] or result2 == [8, 4, 2, 1])
        self.assertTrue(self.is_valid_subset(result2))

    def test_single_element(self):
        self.assertEqual(largestDivisibleSubset([7]), [7])

    def test_two_numbers_divisible(self):
        result = largestDivisibleSubset([3, 9])
        self.assertEqual(set(result), set([3, 9]))
        self.assertTrue(self.is_valid_subset(result))

    def test_no_numbers_divisible(self):
        result = largestDivisibleSubset([2, 3, 5, 7])
        self.assertEqual(len(result), 1)
        self.assertIn(result[0], [2, 3, 5, 7])

    def test_larger_chain(self):
        result = largestDivisibleSubset([1, 3, 6, 24])
        self.assertTrue(self.is_valid_subset(result))
        self.assertEqual(set(result), set([1, 3, 6, 24]))

if __name__ == "__main__":
    unittest.main()`;

    case "Problem 9":
      return `import unittest

class MajorityElementTests(unittest.TestCase):
    def test_example_cases(self):
        self.assertEqual(majorityElement([3, 2, 3]), 3)
        self.assertEqual(majorityElement([2, 2, 1, 1, 1, 2, 2]), 2)

    def test_single_element(self):
        self.assertEqual(majorityElement([1]), 1)

    def test_two_elements(self):
        self.assertEqual(majorityElement([9, 9]), 9)

    def test_large_majority_at_start(self):
        self.assertEqual(majorityElement([5, 5, 5, 1, 2, 3]), 5)

    def test_large_majority_at_end(self):
        self.assertEqual(majorityElement([1, 2, 3, 4, 4, 4, 4, 4]), 4)

    def test_all_same(self):
        self.assertEqual(majorityElement([7, 7, 7, 7, 7]), 7)

if __name__ == "__main__":
    unittest.main()`;
    case "Problem 10":
      return `import unittest

class CompressStringTests(unittest.TestCase):
    def test_example_cases(self):
        self.assertEqual(compress_string("aaabbc"), "a3b2c1")
        self.assertEqual(compress_string("abcd"), "a1b1c1d1")
        self.assertEqual(compress_string("aabbbaa"), "a2b3a2")

    def test_single_character(self):
        self.assertEqual(compress_string("a"), "a1")

    def test_all_same_character(self):
        self.assertEqual(compress_string("aaaaa"), "a5")

    def test_empty_string(self):
        self.assertEqual(compress_string(""), "")

    def test_alternating_characters(self):
        self.assertEqual(compress_string("ababab"), "a1b1a1b1a1b1")

    def test_mixed_case_characters(self):
        self.assertEqual(compress_string("aaAAaa"), "a2A2a2")

    def test_numbers_in_string(self):
        self.assertEqual(compress_string("111222333"), "13" + "23" + "33")

if __name__ == "__main__":
    unittest.main()
`;

    case "Problem 11":
      return `import unittest

class BalancedBracketsTests(unittest.TestCase):
    def test_example_cases(self):
        self.assertTrue(is_balanced("()"))
        self.assertTrue(is_balanced("()[]{}"))
        self.assertFalse(is_balanced("(]"))
        self.assertFalse(is_balanced("([)]"))
        self.assertTrue(is_balanced("{[]}"))

    def test_empty_string(self):
        self.assertTrue(is_balanced(""))

    def test_only_opening_brackets(self):
        self.assertFalse(is_balanced("((("))
        self.assertFalse(is_balanced("[["))
        self.assertFalse(is_balanced("{{{"))

    def test_only_closing_brackets(self):
        self.assertFalse(is_balanced(")))"))
        self.assertFalse(is_balanced("]]"))
        self.assertFalse(is_balanced("}}}"))

    def test_mismatched_brackets(self):
        self.assertFalse(is_balanced("{[}"))
        self.assertFalse(is_balanced("[({})](]"))

    def test_nested_balanced(self):
        self.assertTrue(is_balanced("({[]})"))
        self.assertTrue(is_balanced("(([[{{}}]]))"))

    def test_unbalanced_nested(self):
        self.assertFalse(is_balanced("({[})"))
        self.assertFalse(is_balanced("(([[{{}}]]))]"))

if __name__ == "__main__":
    unittest.main()
`;

    case "Problem 12":
      return `import unittest

class PascalsTriangleTests(unittest.TestCase):
    def test_example_cases(self):
        self.assertEqual(generate_pascals_triangle(1), [[1]])
        self.assertEqual(generate_pascals_triangle(3), [[1], [1, 1], [1, 2, 1]])
        self.assertEqual(
            generate_pascals_triangle(5),
            [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]]
        )

    def test_zero_rows(self):
        self.assertEqual(generate_pascals_triangle(0), [])

    def test_two_rows(self):
        self.assertEqual(generate_pascals_triangle(2), [[1], [1, 1]])

    def test_four_rows(self):
        self.assertEqual(
            generate_pascals_triangle(4),
            [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1]]
        )

    def test_six_rows(self):
        self.assertEqual(
            generate_pascals_triangle(6),
            [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1],
             [1, 4, 6, 4, 1], [1, 5, 10, 10, 5, 1]]
        )

if __name__ == "__main__":
    unittest.main()
`;

    case "Problem 13":
      return `import unittest

class RunLengthDecodingTests(unittest.TestCase):
    def test_example_cases(self):
        self.assertEqual(decode_run_length("a3b2c1"), "aaabbc")
        self.assertEqual(decode_run_length("x5y1"), "xxxxxy")
        self.assertEqual(decode_run_length("m2n3m1"), "mmnnnm")

    def test_single_character(self):
        self.assertEqual(decode_run_length("a1"), "a")

    def test_multiple_digits(self):
        self.assertEqual(decode_run_length("z12"), "zzzzzzzzzzzz")
        self.assertEqual(decode_run_length("a2b10"), "aabbbbbbbbbb")

    def test_alternating_characters(self):
        self.assertEqual(decode_run_length("a1b1a1b1"), "abab")

    def test_long_sequence(self):
        self.assertEqual(decode_run_length("x20"), "x" * 20)

    def test_mixed_letters_and_counts(self):
        self.assertEqual(decode_run_length("a1z2x3y4"), "azzxxxyyyy")

if __name__ == "__main__":
    unittest.main()
`;

    case "Problem 14":
      return `import unittest

class CustomSortTests(unittest.TestCase):
    def test_sort_by_age(self):
        data = [
            {"name": "Alice", "age": 25},
            {"name": "Bob", "age": 22}
        ]
        expected = [
            {"name": "Bob", "age": 22},
            {"name": "Alice", "age": 25}
        ]
        self.assertEqual(sort_by_key(data, "age"), expected)

    def test_sort_by_score(self):
        data = [
            {"name": "Zoe", "score": 70},
            {"name": "Alex", "score": 90}
        ]
        expected = [
            {"name": "Zoe", "score": 70},
            {"name": "Alex", "score": 90}
        ]
        self.assertEqual(sort_by_key(data, "score"), expected)

    def test_sort_by_name(self):
        data = [
            {"name": "Zoe", "score": 70},
            {"name": "Alex", "score": 90}
        ]
        expected = [
            {"name": "Alex", "score": 90},
            {"name": "Zoe", "score": 70}
        ]
        self.assertEqual(sort_by_key(data, "name"), expected)

    def test_sort_descending(self):
        data = [
            {"name": "Alice", "age": 25},
            {"name": "Bob", "age": 22}
        ]
        expected = [
            {"name": "Alice", "age": 25},
            {"name": "Bob", "age": 22}
        ]
        self.assertEqual(sort_by_key(data, "age", reverse=True), expected)

    def test_unsupported_key(self):
        data = [{"name": "Test", "height": 180}]
        self.assertEqual(sort_by_key(data, "height"), "Unsupported key")

    def test_empty_data(self):
        self.assertEqual(sort_by_key([], "age"), [])

    def test_single_entry(self):
        data = [{"name": "Solo", "age": 40}]
        self.assertEqual(sort_by_key(data, "age"), [{"name": "Solo", "age": 40}])

if __name__ == "__main__":
    unittest.main()
`;

    case "Problem 15":
      return `import unittest

class MathOperationsEngineTests(unittest.TestCase):
    def test_addition(self):
        self.assertEqual(compute(5, 3, "+"), 8)

    def test_subtraction(self):
        self.assertEqual(compute(9, 1, "-"), 8)

    def test_multiplication(self):
        self.assertEqual(compute(7, 4, "*"), 28)

    def test_division(self):
        self.assertEqual(compute(10, 2, "/"), 5.0)

    def test_division_by_zero(self):
        self.assertEqual(compute(5, 0, "/"), "Error: Division by zero")

    def test_unknown_operation(self):
        self.assertEqual(compute(5, 3, "^"), "Unknown operation")

    def test_zero_values(self):
        self.assertEqual(compute(0, 0, "+"), 0)
        self.assertEqual(compute(0, 5, "*"), 0)

    def test_negative_numbers(self):
        self.assertEqual(compute(-4, -6, "+"), -10)
        self.assertEqual(compute(-4, 2, "*"), -8)
        self.assertEqual(compute(-8, -2, "/"), 4.0)

if __name__ == "__main__":
    unittest.main()
`;

    case "Problem 16":
      return `import unittest

class DigitOperationTransformerTests(unittest.TestCase):
    def test_sum_operation(self):
        self.assertEqual(transform_digits(1234, "sum"), 10)
        self.assertEqual(transform_digits(0, "sum"), 0)

    def test_product_operation(self):
        self.assertEqual(transform_digits(1234, "product"), 24)
        self.assertEqual(transform_digits(101, "product"), 0)
        self.assertEqual(transform_digits(1, "product"), 1)

    def test_max_operation(self):
        self.assertEqual(transform_digits(5983, "max"), 9)
        self.assertEqual(transform_digits(1111, "max"), 1)
        self.assertEqual(transform_digits(0, "max"), 0)

    def test_count_non_zero_operation(self):
        self.assertEqual(transform_digits(1010, "count_non_zero"), 2)
        self.assertEqual(transform_digits(1000001, "count_non_zero"), 2)
        self.assertEqual(transform_digits(0, "count_non_zero"), 0)

    def test_single_digit_input(self):
        self.assertEqual(transform_digits(7, "sum"), 7)
        self.assertEqual(transform_digits(7, "product"), 7)
        self.assertEqual(transform_digits(7, "max"), 7)
        self.assertEqual(transform_digits(7, "count_non_zero"), 1)

    def test_unknown_operation(self):
        self.assertEqual(transform_digits(1234, "average"), "Unknown operation")

if __name__ == "__main__":
    unittest.main()
`;

    case "Problem 17":
      return `import unittest

class GridAnalysisTests(unittest.TestCase):
    def test_max_row_sum(self):
        grid = [[1, 2], [3, 4]]
        self.assertEqual(analyze_grid(grid, "max_row_sum"), 7)

        grid = [[-1, -2], [-3, -4]]
        self.assertEqual(analyze_grid(grid, "max_row_sum"), -3)

    def test_max_column_sum(self):
        grid = [[1, 2, 3], [4, 5, 6]]
        self.assertEqual(analyze_grid(grid, "max_column_sum"), 9)

        grid = [[-1, -2], [-3, -1]]
        self.assertEqual(analyze_grid(grid, "max_column_sum"), -3)

    def test_single_row_and_column(self):
        grid = [[7]]
        self.assertEqual(analyze_grid(grid, "max_row_sum"), 7)
        self.assertEqual(analyze_grid(grid, "max_column_sum"), 7)

    def test_empty_grid(self):
        self.assertRaises(ValueError, analyze_grid, [], "max_row_sum")

    def test_unknown_operation(self):
        grid = [[1, 2], [3, 4]]
        self.assertEqual(analyze_grid(grid, "diagonal_sum"), "Unknown operation")

if __name__ == "__main__":
    unittest.main()
`;

    case "Problem 18":
      return `import unittest

class MatrixRotationTests(unittest.TestCase):
    def test_2x2_matrix(self):
        matrix = [
            [1, 2],
            [3, 4]
        ]
        expected = [
            [3, 1],
            [4, 2]
        ]
        self.assertEqual(rotate_matrix(matrix), expected)

    def test_3x3_matrix(self):
        matrix = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]
        ]
        expected = [
            [7, 4, 1],
            [8, 5, 2],
            [9, 6, 3]
        ]
        self.assertEqual(rotate_matrix(matrix), expected)

    def test_1x1_matrix(self):
        matrix = [[1]]
        expected = [[1]]
        self.assertEqual(rotate_matrix(matrix), expected)

    def test_4x4_matrix(self):
        matrix = [
            [1, 2, 3, 4],
            [5, 6, 7, 8],
            [9, 10,11,12],
            [13,14,15,16]
        ]
        expected = [
            [13, 9, 5, 1],
            [14,10, 6, 2],
            [15,11, 7, 3],
            [16,12, 8, 4]
        ]
        self.assertEqual(rotate_matrix(matrix), expected)

    def test_non_square_matrix(self):
        matrix = [
            [1, 2, 3],
            [4, 5, 6]
        ]
        with self.assertRaises(ValueError):
            rotate_matrix(matrix)


if __name__ == "__main__":
    unittest.main()
`;
    case "Problem 19":
      return `import unittest

class HistogramBinningTests(unittest.TestCase):
    def test_example_case_1(self):
        numbers = [3, 7, 12, 18, 21]
        bins = [(0,10), (11,20), (21,30)]
        expected = {
            "0–10": 2,
            "11–20": 2,
            "21–30": 1
        }
        self.assertEqual(bin_numbers(numbers, bins), expected)

    def test_example_case_2(self):
        numbers = [5, 15, 25, 35, 45]
        bins = [(0,20), (21,40)]
        expected = {
            "0–20": 2,
            "21–40": 2
        }
        self.assertEqual(bin_numbers(numbers, bins), expected)

    def test_empty_numbers(self):
        numbers = []
        bins = [(0,10), (10,20)]
        expected = {
            "0–10": 0,
            "10–20": 0
        }
        self.assertEqual(bin_numbers(numbers, bins), expected)

    def test_empty_bins(self):
        numbers = [1, 2, 3]
        bins = []
        expected = {}
        self.assertEqual(bin_numbers(numbers, bins), expected)

    def test_edge_inclusivity(self):
        numbers = [0, 10, 11, 20]
        bins = [(0,10), (11,20)]
        expected = {
            "0–10": 2,  # includes both 0 and 10
            "11–20": 2  # includes both 11 and 20
        }
        self.assertEqual(bin_numbers(numbers, bins), expected)

    def test_overlapping_bins(self):
        numbers = [5, 10, 15]
        bins = [(0,10), (10,20)]
        expected = {
            "0–10": 2,  # 5 and 10
            "10–20": 2  # 10 and 15
        }
        self.assertEqual(bin_numbers(numbers, bins), expected)

if __name__ == "__main__":
    unittest.main()
`;

    case "Problem 20":
      return `import unittest
import math

class CoordinateConversionTests(unittest.TestCase):
    def test_to_polar_basic(self):
        r, theta = convert_coordinates(3, 4, "to_polar")
        self.assertTrue(math.isclose(r, 5.0, abs_tol=1e-9))
        self.assertTrue(math.isclose(theta, math.atan2(4, 3), abs_tol=1e-9))

    def test_to_polar_zero(self):
        r, theta = convert_coordinates(0, 0, "to_polar")
        self.assertTrue(math.isclose(r, 0.0, abs_tol=1e-9))
        self.assertTrue(math.isclose(theta, 0.0, abs_tol=1e-9))

    def test_to_cartesian_basic(self):
        r = 5
        theta = math.pi / 4  # 45 degrees
        x_expected = r * math.cos(theta)
        y_expected = r * math.sin(theta)
        x, y = convert_coordinates(r, theta, "to_cartesian")
        self.assertTrue(math.isclose(x, x_expected, abs_tol=1e-9))
        self.assertTrue(math.isclose(y, y_expected, abs_tol=1e-9))

    def test_to_cartesian_zero_radius(self):
        x, y = convert_coordinates(0, math.pi, "to_cartesian")
        self.assertTrue(math.isclose(x, 0.0, abs_tol=1e-9))
        self.assertTrue(math.isclose(y, 0.0, abs_tol=1e-9))

    def test_invalid_mode(self):
        self.assertEqual(convert_coordinates(1, 1, "to_cylindrical"), "Invalid mode")

if __name__ == "__main__":
    unittest.main()
`;

    case "Problem 21":
      return `import unittest

class RomanConverterTests(unittest.TestCase):
    # Integer to Roman
    def test_to_roman_basic(self):
        self.assertEqual(roman_converter(1, "to_roman"), "I")
        self.assertEqual(roman_converter(4, "to_roman"), "IV")
        self.assertEqual(roman_converter(9, "to_roman"), "IX")
        self.assertEqual(roman_converter(58, "to_roman"), "LVIII")
        self.assertEqual(roman_converter(1994, "to_roman"), "MCMXCIV")

    def test_to_roman_edge_cases(self):
        self.assertEqual(roman_converter(3999, "to_roman"), "MMMCMXCIX")
        self.assertEqual(roman_converter(49, "to_roman"), "XLIX")
        self.assertEqual(roman_converter(444, "to_roman"), "CDXLIV")

    # Roman to Integer
    def test_to_integer_basic(self):
        self.assertEqual(roman_converter("I", "to_integer"), 1)
        self.assertEqual(roman_converter("IV", "to_integer"), 4)
        self.assertEqual(roman_converter("IX", "to_integer"), 9)
        self.assertEqual(roman_converter("LVIII", "to_integer"), 58)
        self.assertEqual(roman_converter("MCMXCIV", "to_integer"), 1994)

    def test_to_integer_edge_cases(self):
        self.assertEqual(roman_converter("MMMCMXCIX", "to_integer"), 3999)
        self.assertEqual(roman_converter("XLIX", "to_integer"), 49)
        self.assertEqual(roman_converter("CDXLIV", "to_integer"), 444)

    # Round-trip checks
    def test_round_trip_conversion(self):
        for num in [1, 4, 9, 44, 99, 2023, 3999]:
            roman = roman_converter(num, "to_roman")
            self.assertEqual(roman_converter(roman, "to_integer"), num)

    def test_invalid_mode(self):
        self.assertEqual(roman_converter(123, "invalid_mode"), "Invalid mode")
        self.assertEqual(roman_converter("XII", "none"), "Invalid mode")

if __name__ == "__main__":
    unittest.main()
`;

    case "Problem 22":
      return `import unittest

class FlexibleFilterTests(unittest.TestCase):
    def test_is_even(self):
        self.assertEqual(filter_list([1, 2, 3, 4], is_even), [2, 4])

    def test_is_multiple_of_five(self):
        self.assertEqual(filter_list([10, 15, 20, 25], is_multiple_of_five), [10, 15, 20, 25])
        self.assertEqual(filter_list([1, 2, 3], is_multiple_of_five), [])

    def test_starts_with(self):
        self.assertEqual(filter_list(["apple", "banana", "kiwi"], starts_with("b")), ["banana"])
        self.assertEqual(filter_list(["apple", "banana", "blueberry"], starts_with("a")), ["apple"])

    def test_empty_list(self):
        self.assertEqual(filter_list([], is_even), [])

    def test_no_matches(self):
        self.assertEqual(filter_list([1, 3, 5], is_even), [])

if __name__ == "__main__":
    unittest.main()
`;

    case "Problem 23":
      return `import unittest

class GroupByTests(unittest.TestCase):
    def test_group_by_first_letter(self):
        words = ["apple", "banana", "avocado", "blueberry"]
        expected = {
            "a": ["apple", "avocado"],
            "b": ["banana", "blueberry"]
        }
        result = group_by(words, lambda word: word[0])
        self.assertEqual(result, expected)

    def test_group_by_parity(self):
        numbers = [1, 2, 3, 4, 5, 6]
        expected = {
            "odd": [1, 3, 5],
            "even": [2, 4, 6]
        }
        result = group_by(numbers, lambda n: "even" if n % 2 == 0 else "odd")
        self.assertEqual(result, expected)

    def test_group_by_length(self):
        words = ["hi", "hello", "yo", "yes"]
        expected = {
            2: ["hi", "yo"],
            3: ["yes"],
            5: ["hello"]
        }
        result = group_by(words, lambda word: len(word))
        self.assertEqual(result, expected)

    def test_empty_input(self):
        self.assertEqual(group_by([], lambda x: x), {})

    def test_group_all_same_key(self):
        items = [1, 2, 3]
        expected = {
            "constant": [1, 2, 3]
        }
        result = group_by(items, lambda x: "constant")
        self.assertEqual(result, expected)

if __name__ == "__main__":
    unittest.main()
`;

    case "Problem 24":
      return `import unittest

class AggregateTests(unittest.TestCase):
    def test_sum(self):
        self.assertEqual(aggregate([1, 2, 3, 4], lambda acc, x: acc + x), 10)

    def test_max(self):
        self.assertEqual(aggregate([4, 5, 6], lambda acc, x: acc if acc > x else x), 6)

    def test_product(self):
        self.assertEqual(aggregate([2, 3, 4], lambda acc, x: acc * x), 24)

    def test_string_concat(self):
        self.assertEqual(aggregate(["a", "b", "c"], lambda acc, x: acc + x), "abc")

    def test_min(self):
        self.assertEqual(aggregate([5, 2, 8, 1], lambda acc, x: x if x < acc else acc), 1)

    def test_single_element(self):
        self.assertEqual(aggregate([42], lambda acc, x: acc + x), 42)

    def test_empty_list(self):
        with self.assertRaises(TypeError):  # reduce throws error on empty list
            aggregate([], lambda acc, x: acc + x)

if __name__ == "__main__":
    unittest.main()
`;

    case "Problem 25":
      return `import unittest

class MultiCriteriaSorterTests(unittest.TestCase):
    def test_score_then_age(self):
        data = [
            {"name": "Alice", "age": 25, "score": 90},
            {"name": "Bob", "age": 22, "score": 90},
            {"name": "Clara", "age": 25, "score": 85}
        ]
        expected = [
            {"name": "Clara", "age": 25, "score": 85},
            {"name": "Bob", "age": 22, "score": 90},
            {"name": "Alice", "age": 25, "score": 90}
        ][::-1]  # reverse to match sort order of score DESC, age ASC
        result = sorted(data, key=lambda x: (-x["score"], x["age"]))
        self.assertEqual(multi_sort(data, ["score", "age"]), result)

    def test_rating_then_year(self):
        data = [
            {"title": "Book A", "year": 2001, "rating": 4.5},
            {"title": "Book B", "year": 1999, "rating": 4.5}
        ]
        expected = sorted(data, key=lambda x: (-x["rating"], x["year"]))
        self.assertEqual(multi_sort(data, ["rating", "year"]), expected)

    def test_single_key(self):
        data = [
            {"name": "Zoe", "age": 30},
            {"name": "Anna", "age": 25},
        ]
        expected = sorted(data, key=lambda x: x["name"])
        self.assertEqual(multi_sort(data, ["name"]), expected)

    def test_no_keys(self):
        data = [{"a": 1}, {"a": 2}]
        self.assertEqual(multi_sort(data, []), data)  # no sorting applied

    def test_empty_data(self):
        self.assertEqual(multi_sort([], ["any"]), [])

if __name__ == "__main__":
    unittest.main()
`;

    case "Problem 26":
      return `import unittest

class TextNormalizationPipelineTests(unittest.TestCase):
    def test_example_1(self):
        text = "  Hello, WORLD!!  "
        steps = ["lowercase", "strip", "remove_punctuation"]
        expected = "hello world"
        self.assertEqual(normalize(text, steps), expected)

    def test_example_2(self):
        text = "  This is a Test. "
        steps = ["strip", "lowercase", "remove_punctuation", "tokenize"]
        expected = ["this", "is", "a", "test"]
        self.assertEqual(normalize(text, steps), expected)

    def test_example_3(self):
        text = "Keep-Going!"
        steps = ["remove_punctuation"]
        expected = "KeepGoing"
        self.assertEqual(normalize(text, steps), expected)

    def test_no_steps(self):
        text = "  No changes! "
        self.assertEqual(normalize(text, []), text)

    def test_only_tokenize(self):
        text = "Split this sentence"
        self.assertEqual(normalize(text, ["tokenize"]), ["Split", "this", "sentence"])

if __name__ == "__main__":
    unittest.main()
`;

    case "Problem 27":
      return `import unittest

class WordFrequencyAnalyzerTests(unittest.TestCase):
    def test_example_1(self):
        text = "The cat sat on the mat. The mat was flat."
        stopwords = ["the", "on", "was"]
        expected = {
            "cat": 1,
            "sat": 1,
            "mat": 2,
            "flat": 1
        }
        self.assertEqual(analyze_frequencies(text, stopwords), expected)

    def test_example_2(self):
        text = "apple banana apple orange banana apple"
        stopwords = []
        expected = {
            "apple": 3,
            "banana": 2,
            "orange": 1
        }
        self.assertEqual(analyze_frequencies(text, stopwords), expected)

    def test_empty_text(self):
        self.assertEqual(analyze_frequencies("", ["a", "b"]), {})

    def test_only_stopwords(self):
        text = "The the THE"
        stopwords = ["the"]
        self.assertEqual(analyze_frequencies(text, stopwords), {})

    def test_punctuation_and_case(self):
        text = "Wow! wow, WoW."
        stopwords = []
        expected = {"wow": 3}
        self.assertEqual(analyze_frequencies(text, stopwords), expected)

    def test_with_numbers_and_symbols(self):
        text = "Money: $100 is a lot! But $100 is common."
        stopwords = ["is", "a", "but"]
        expected = {
            "money": 1,
            "100": 2,
            "lot": 1,
            "common": 1
        }
        self.assertEqual(analyze_frequencies(text, stopwords), expected)

if __name__ == "__main__":
    unittest.main()
`;

    case "Problem 28":
      return `import unittest

class CommandExecutorTests(unittest.TestCase):
    def test_add(self):
        self.assertEqual(execute_command("add 3 5"), 8)

    def test_subtract(self):
        self.assertEqual(execute_command("substract 9 4"), 5)

    def test_multiply(self):
        self.assertEqual(execute_command("multiply 4 2"), 8)

    def test_divide(self):
        self.assertEqual(execute_command("divide 10 2"), 5)

    def test_division_by_zero(self):
        self.assertEqual(execute_command("divide 10 0"), "Error: Division by zero")

    def test_unknown_command(self):
        self.assertEqual(execute_command("power 2 3"), "Error: Unknown command")

    def test_negative_numbers(self):
        self.assertEqual(execute_command("add -5 -3"), -8)
        self.assertEqual(execute_command("substract -10 -4"), -6)
        self.assertEqual(execute_command("multiply -2 3"), -6)

    def test_invalid_input_format(self):
        with self.assertRaises(IndexError):
            execute_command("add 3")  # Missing one operand

        with self.assertRaises(ValueError):
            execute_command("add three 5")  # Invalid int conversion

if __name__ == "__main__":
    unittest.main()
`;

    case "Problem 29":
      return `import unittest

class ExpressionEvaluatorTests(unittest.TestCase):
    def test_addition_and_multiplication(self):
        self.assertEqual(evaluate("3 + 4 * 2"), 11)

    def test_mixed_operations(self):
        self.assertEqual(evaluate("10 + 2 * 6"), 22)
        self.assertEqual(evaluate("100 * 2 + 12"), 212)

    def test_all_operations(self):
        self.assertEqual(evaluate("100 + 200 * 3 - 50 / 5"), 100 + 200 * 3 - 50 // 5)  # 100 + 600 - 10 = 690

    def test_single_number(self):
        self.assertEqual(evaluate("42"), 42)

    def test_division(self):
        self.assertEqual(evaluate("20 / 5"), 4)
        self.assertEqual(evaluate("20 / 3"), 6)  # uses integer division (//)

    def test_multiple_same_precedence(self):
        self.assertEqual(evaluate("8 / 2 * 3"), 12)  # 4 * 3 = 12

    def test_parentheses_placeholder(self):
        # This currently doesn't work and would raise KeyError or return wrong result
        with self.assertRaises(KeyError):
            evaluate("100 * ( 2 + 12 )")

    def test_invalid_token(self):
        with self.assertRaises(KeyError):
            evaluate("2 + x")

if __name__ == "__main__":
    unittest.main()
`;

    default:
      return `import unittest

class DefaultTests(unittest.TestCase):
    def test_placeholder(self):
        self.assertTrue(True)  # Replace with actual tests

if __name__ == "__main__":
    unittest.main()`;
  }
}
