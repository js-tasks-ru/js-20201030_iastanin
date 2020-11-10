/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (size >= 0) {
    let c = 0;
    return string.split('').reduce((prev, curr) => {
      prev[prev.length - 1] === curr ? c++ : (c = 1);
      return c <= size ? prev + curr : prev + '';
    }, '');
  }
  return string;
}
