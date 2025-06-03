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

    default:
      return `import unittest

class DefaultTests(unittest.TestCase):
    def test_placeholder(self):
        self.assertTrue(True)  # Replace with actual tests

if __name__ == "__main__":
    unittest.main()`;
  }
}
