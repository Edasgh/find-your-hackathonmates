export const areArraysEqual=(arr1, arr2) =>{
  if (arr1 === arr2) return true; // Check if they are the exact same reference
  if (arr1 == null || arr2 == null) return false; // Check for null or undefined
  if (arr1.length !== arr2.length) return false; // Check if lengths are different

  // Check each element for strict equality (===)
  return arr1.every((element, index) => element === arr2[index]);
}
