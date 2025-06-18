export const problemDetailsMap: { [key: string]: string } = {
  "Problem 1": `
Roman to Integer

Description:
Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M.
Given a roman numeral, convert it to an integer.

Example 1:
Input: "III"
Output: 3

Example 2:
Input: "LVIII"
Output: 58

Example 3:
Input: "MCMXCIV"
Output: 1994
  `,
  "Problem 2": `Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.

You must write an algorithm with O(log n) runtime complexity.

 

Example 1:

Input: nums = [1,3,5,6], target = 5
Output: 2

Example 2:

Input: nums = [1,3,5,6], target = 2
Output: 1

Example 3:

Input: nums = [1,3,5,6], target = 7
Output: 4"`,
  "Problem 3": `You are given a large integer represented as an integer array digits, where each digits[i] is the ith digit of the integer. The digits are ordered from most significant to least significant in left-to-right order. The large integer does not contain any leading 0's.

Increment the large integer by one and return the resulting array of digits.

 

Example 1:

Input: digits = [1,2,3]
Output: [1,2,4]
Explanation: The array represents the integer 123.
Incrementing by one gives 123 + 1 = 124.
Thus, the result should be [1,2,4].

Example 2:

Input: digits = [4,3,2,1]
Output: [4,3,2,2]
Explanation: The array represents the integer 4321.
Incrementing by one gives 4321 + 1 = 4322.
Thus, the result should be [4,3,2,2].

Example 3:

Input: digits = [9]
Output: [1,0]
Explanation: The array represents the integer 9.
Incrementing by one gives 9 + 1 = 10.
Thus, the result should be [1,0].`,
  "Problem 4": `You are climbing a staircase. It takes n steps to reach the top.

Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?

 

Example 1:

Input: n = 2
Output: 2
Explanation: There are two ways to climb to the top.
1. 1 step + 1 step
2. 2 steps

Example 2:

Input: n = 3
Output: 3
Explanation: There are three ways to climb to the top.
1. 1 step + 1 step + 1 step
2. 1 step + 2 steps
3. 2 steps + 1 step`,
  "Problem 5": `You are given an array prices where prices[i] is the price of a given stock on the ith day.

You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.

 

Example 1:

Input: prices = [7,1,5,3,6,4]
Output: 5
Explanation: Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.
Note that buying on day 2 and selling on day 1 is not allowed because you must buy before you sell.

Example 2:

Input: prices = [7,6,4,3,1]
Output: 0
Explanation: In this case, no transactions are done and the max profit = 0.`,
  "Problem 6": `Given an integer n, return an array ans of length n + 1 such that for each i (0 <= i <= n), ans[i] is the number of 1's in the binary representation of i.

 

Example 1:

Input: n = 2
Output: [0,1,1]
Explanation:
0 --> 0
1 --> 1
2 --> 10

Example 2:

Input: n = 5
Output: [0,1,1,2,1,2]
Explanation:
0 --> 0
1 --> 1
2 --> 10
3 --> 11
4 --> 100
5 --> 101`,
  "Problem 7": `Given two strings s and t, return true if s is a subsequence of t, or false otherwise.

A subsequence of a string is a new string that is formed from the original string by deleting some (can be none) of the characters without disturbing the relative positions of the remaining characters. (i.e., "ace" is a subsequence of "abcde" while "aec" is not).

 

Example 1:

Input: s = "abc", t = "ahbgdc"
Output: true

Example 2:

Input: s = "axc", t = "ahbgdc"
Output: false`,
  "Problem 8": `Given a set of distinct positive integers nums, return the largest subset answer such that every pair (answer[i], answer[j]) of elements in this subset satisfies:

answer[i] % answer[j] == 0, or
answer[j] % answer[i] == 0

If there are multiple solutions, return any of them.



Example 1:

Input: nums = [1,2,3]
Output: [1,2]
Explanation: [1,3] is also accepted.

Example 2:

Input: nums = [1,2,4,8]
Output: [1,2,4,8]`,
  "Problem 9": `Given an array nums of size n, return the majority element.

The majority element is the element that appears more than ⌊n / 2⌋ times. You may assume that the majority element always exists in the array.

 

Example 1:

Input: nums = [3,2,3]
Output: 3

Example 2:

Input: nums = [2,2,1,1,1,2,2]
Output: 2`,
  "Problem 10": `
String Compression

Description:
Given a string containing consecutive repeating characters, compress it by replacing each group of the same character with the character followed by the count of repetitions.

You must process the string and return the compressed form. If a character appears only once, it should still be followed by '1'.

Example 1:
Input: "aaabbc"
Output: "a3b2c1"

Example 2:
Input: "abcd"
Output: "a1b1c1d1"

Example 3:
Input: "aabbbaa"
Output: "a2b3a2"
`,
  "Problem 11": `
Balanced Brackets Checker

Description:
Given a string containing only the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.

Example 1:
Input: "()"
Output: true

Example 2:
Input: "()[]{}"
Output: true

Example 3:
Input: "(]"
Output: false

Example 4:
Input: "([)]"
Output: false

Example 5:
Input: "{[]}"
Output: true
`,
  "Problem 12": `
Pascal’s Triangle Generator

Description:
Given an integer numRows, generate the first numRows of Pascal’s Triangle.

In Pascal’s Triangle, each number is the sum of the two numbers directly above it.

Example 1:
Input: numRows = 1
Output: [[1]]

Example 2:
Input: numRows = 3
Output: [[1], [1,1], [1,2,1]]

Example 3:
Input: numRows = 5
Output: [[1], [1,1], [1,2,1], [1,3,3,1], [1,4,6,4,1]]
`,
  "Problem 13": `
Run-Length Decoding

Description:
You are given a string that represents a run-length encoded sequence. Each character is immediately followed by a positive integer indicating how many times that character appears.

Write a function to decode the string and return the expanded version.

Example 1:
Input: "a3b2c1"
Output: "aaabbc"

Example 2:
Input: "x5y1"
Output: "xxxxxy"

Example 3:
Input: "m2n3m1"
Output: "mmnnnm"
`,
  "Problem 14": `
Custom Sort

Description:
Given a list of dictionaries representing objects (e.g., students with attributes like name, age, score), sort the list based on a specified key.

The function should be flexible enough to sort by any field and optionally in ascending order.

Example 1:
Input: 
  data = [
    { name: "Alice", age: 25 },
    { name: "Bob", age: 22 }
  ], 
  key = "age"
Output: 
  [
    { name: "Bob", age: 22 },
    { name: "Alice", age: 25 }
  ]

Example 2:
Input: 
  data = [
    { name: "Zoe", score: 70 },
    { name: "Alex", score: 90 }
  ],
  key = "score"
Output:
  [
    { name: "Zoe", score: 70 },
    { name: "Alex", score: 90 }
  ]
`,
  "Problem 15": `
Math Operations Engine

Description:
Write a function that takes two numbers and an operation symbol ('+', '-', '*', '/') and returns the result of applying that operation.

Example 1:
Input: a = 5, b = 3, op = "+"
Output: 8

Example 2:
Input: a = 10, b = 2, op = "/"
Output: 5.0

Example 3:
Input: a = 7, b = 4, op = "*"
Output: 28

Example 4:
Input: a = 9, b = 1, op = "-"
Output: 8
`,
  "Problem 16": `
Digit Operation Transformer

Description:
Given a positive integer, write a function that applies a digit-based operation such as summing, multiplying, or finding the max of its digits.

Example 1:
Input: n = 1234, operation = sum
Output: 10

Example 2:
Input: n = 1234, operation = product
Output: 24

Example 3:
Input: n = 5983, operation = max
Output: 9

Example 4:
Input: n = 1010, operation = count of non-zero digits
Output: 2
`,
  "Problem 17": `
2D Grid Search Variants

Description:
Given a 2D grid of integers, write a function to perform various search or analysis operations, such as:

- Finding the row with the maximum sum
- Finding the column with the maximum sum

Example 1:
Input: grid = [[1, 2], [3, 4]], operation = "max_row_sum"
Output: 7

Example 2:
Input: grid = [[1, 2, 3], [4, 5, 6]], operation = "max_column_sum"
Output: 9
`,
  "Problem 18": `
Matrix Rotation

Description:
Given a 2D matrix, rotate it 90 degrees clockwise in-place.

This problem emphasizes separating the pure matrix transformation logic from any I/O, printing, or formatting logic. It also encourages thinking in terms of index manipulation and modular function design.

In case the Matrix is not squared you should throw a Value Error.

Example 1:
Input:
[
  [1, 2],
  [3, 4]
]
Output:
[
  [3, 1],
  [4, 2]
]

Example 2:
Input:
[
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
]
Output:
[
  [7, 4, 1],
  [8, 5, 2],
  [9, 6, 3]
]
`,
  "Problem 19": `
Histogram Binning

Description:
Given a list of numbers and a list of bin ranges, count how many numbers fall into each bin.

Example 1:
Input:
  numbers = [3, 7, 12, 18, 21]
  bins = [(0,10), (11,20), (21,30)]
Output:
  {
    "0–10": 2,
    "11–20": 2,
    "21–30": 1
  }

Example 2:
Input:
  numbers = [5, 15, 25, 35, 45]
  bins = [(0,20), (21,40)]
Output:
  {
    "0–20": 2,
    "21–40": 2
  }
`,
  "Problem 20": `
Coordinate Conversion

Description:
Write a function convert_coordinates(a, b, mode) that converts between Cartesian coordinates (x, y) and Polar coordinates (r, θ).

If mode == "to_polar":
Interpret inputs as x, y, and return (r, θ) where:

r = sqrt(x² + y²)

θ = atan2(y, x) in radians

If mode == "to_cartesian":
Interpret inputs as r, θ, and return (x, y) where:

x = r * cos(θ)

y = r * sin(θ)
`,
  "Problem 21": `Roman Numeral Converter

Implement a function roman_converter(value, mode) that can:

Convert an integer to a Roman numeral when mode == "to_roman"

Convert a Roman numeral to an integer when mode == "to_integer"

Constraints:

For to_roman: 1 <= value <= 3999

For to_integer: input must be a valid Roman numeral in standard form
`,
  "Problem 22": `
Flexible Filter

Description:
You are given a function called filter_list that accepts a list and a predicate function. The filter_list function is already implemented and works as expected.

Your task is to define different predicate functions and pass them to filter_list to filter elements based on different rules.

Example 1:
Input: numbers = [1, 2, 3, 4], predicate = is_even
Output: [2, 4]

Example 2:
Input: numbers = [10, 15, 20, 25], predicate = is_multiple_of_five
Output: [10, 15, 20, 25]

Example 3:
Input: strings = ["apple", "banana", "kiwi"], predicate = starts_with('b')
Output: ["banana"]
`,
  "Problem 23": `
Custom Grouping

Description:
Write a function group_by(data, key_fn) that groups items from a list based on a key-generating function.

The function key_fn should take a single item and return a grouping key. Your function should return a dictionary where each key maps to a list of items that belong to that group.

Example 1:
Input:
  words = ["apple", "banana", "avocado", "blueberry"]
  key_fn = lambda word: word[0]
Output:
  {
    "a": ["apple", "avocado"],
    "b": ["banana", "blueberry"]
  }

Example 2:
Input:
  numbers = [1, 2, 3, 4, 5, 6]
  key_fn = lambda n: "even" if n % 2 == 0 else "odd"
Output:
  {
    "even": [2, 4, 6],
    "odd": [1, 3, 5]
  }
`,
  "Problem 24": `
Generic Aggregator

Description:
Write a function aggregate(data, agg_fn) that takes a list of values and a function that aggregates them into a single result (sum, max, min).

Example 1:
Input: numbers = [1, 2, 3, 4], agg_fn = sum
Output: 10

Example 2:
Input: numbers = [4, 5, 6], agg_fn = max
Output: 6

Example 3:
Input: numbers = [2, 3, 4], agg_fn = lambda acc, x: acc * x
Output: 24

Example 4:
Input: strings = ["a", "b", "c"], agg_fn = lambda acc, x: acc + x
Output: "abc"
`,
  "Problem 25": `
Multi-Criteria Sorter

Description:
Given a list of dictionaries and multiple sort keys, write a function that sorts the list based on a compound key (e.g., sort first by score, then by age).


Example 1:
Input: 
  data = [
    { name: "Alice", age: 25, score: 90 },
    { name: "Bob", age: 22, score: 90 },
    { name: "Clara", age: 25, score: 85 }
  ],
  keys = ["score", "age"]
Output:
  [
    { name: "Bob", age: 22, score: 90 },
    { name: "Alice", age: 25, score: 90 },
    { name: "Clara", age: 25, score: 85 }
  ]

Example 2:
Input: 
  data = [
    { title: "Book A", year: 2001, rating: 4.5 },
    { title: "Book B", year: 1999, rating: 4.5 }
  ],
  keys = ["rating", "year"]
Output:
  [
    { title: "Book B", year: 1999, rating: 4.5 },
    { title: "Book A", year: 2001, rating: 4.5 }
  ]
`,
  "Problem 26": `
Text Normalization Pipeline

Description:
Write a function that applies a series of transformation steps to normalize input text. These steps are:

- converting to lowercase
- stripping whitespace 
- removing punctuation
- and tokenizing

and they are given as a list of strings.


Example 1:
Input: text = "  Hello, WORLD!!  ", steps = ["lowercase", "strip", "remove_punctuation"]
Output: "hello world"

Example 2:
Input: text = "  This is a Test. ", steps = ["strip", "lowercase", "tokenize"]
Output: ["this", "is", "a", "test"]

Example 3:
Input: text = "Keep-Going!", steps = ["remove_punctuation"]
Output: "KeepGoing"
`,
  "Problem 27": `
Word Frequency Analyzer

Description:
Write a function that analyzes a block of text and returns the most frequent words, excluding common stopwords.

Example 1:
Input: 
  text = "The cat sat on the mat. The mat was flat."
  stopwords = ["the", "on", "was"]
Output:
  {
    "mat": 2,
    "cat": 1,
    "sat": 1,
    "flat": 1
  }

Example 2:
Input:
  text = "apple banana apple orange banana apple"
  stopwords = []
Output:
  {
    "apple": 3,
    "banana": 2,
    "orange": 1
  }
`,
  "Problem 28": `
Command Executor

Description:
Build a simple command-line interpreter that reads a command string (e.g., "add 3 5") and executes the correct function based on the command.

Commands are:
    - add
    - substract
    - multiply
    - divide

Example 1:
Input: "add 3 5"
Output: 8

Example 2:
Input: "multiply 4 2"
Output: 8

Example 3:
Input: "divide 10 2"
Output: 5

Example 4:
Input: "subtract 9 4"
Output: 5
`,
  "Problem 29": `
Expression Evaluator

Description:
Write a function that takes a string representing a basic arithmetic expression and evaluates it. The expression may contain integers, spaces, the operators +, -, *, and / (integer division), and parentheses.

The evaluator should respect standard arithmetic precedence:
- Multiplication (*) and division (/) have higher precedence than addition (+) and subtraction (-)
- Parentheses should be evaluated first to override normal precedence rules

The function should raise a KeyError if the expression contains any invalid tokens, such as unrecognized characters or malformed input.

You can assume that valid input will have properly spaced tokens (e.g., "3 + 4", not "3+4").

Example 1:
Input: "3 + 4 * 2"
Output: 11

Example 2:
Input: "10 + 2 * 6"
Output: 22

Example 3:
Input: "100 * 2 + 12"
Output: 212

Example 4:
Input: "100 * ( 2 + 12 )"
Output: 1400

Example 5:
Input: "2 + x"
Raises: KeyError (invalid token 'x')
`,
};
