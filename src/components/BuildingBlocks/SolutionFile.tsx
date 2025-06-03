export default function getDefaultFileCode(problemId: string): string {
  switch (problemId) {
    case "Problem 1":
      return `def romanToInt(s: str) -> int:
    # TODO: implement
    pass`;
    case "Problem 2":
      return `def searchInsert(nums: List[int], target: int) -> int:
    # TODO: implement
    pass`;
    case "Problem 3":
      return `def plusOne(digits: List[int]) -> List[int]:
    # TODO: implement
    pass`;
    case "Problem 4":
      return `def climbStairs(n: int) -> int:
    # TODO: implement
    pass`;
    case "Problem 5":
      return `def maxProfit(prices: List[int]) -> int:
    # TODO: implement
    pass`;
    case "Problem 6":
      return `def countBits(n: int) -> List[int]:
    # TODO: implement
    pass`;
    case "Problem 7":
      return `def isSubsequence(s: str, t: str) -> bool:
    # TODO: implement
    pass`;
    case "Problem 8":
      return `def largestDivisibleSubset(nums: List[int]) -> List[int]:
    # TODO: implement
    pass`;
    case "Problem 9":
      return `def majorityElement(nums: List[int]) -> int:
    # TODO: implement
    pass`;
    default:
      return `def solution(x):
    # TODO: implement
    pass`;
  }
}
