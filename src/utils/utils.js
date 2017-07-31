export function capitalizeFirstLetter(string) {
  const str = String(string);
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function seq(count) {
  return Array(count).fill(null).map( (item, index)=>( index ) );
}

export function sortByKey(key) {
  return (itemA, itemB) => {
    if (itemA.get(key) < itemB.get(key)) { return -1; }
    if (itemA.get(key) > itemB.get(key)) { return 1; }
    if (itemA.get(key) === itemB.get(key)) { return 0; }
  };
}

/* intersperse: Return an array with the separator interspersed between
 * each element of the input array.
 *
 * > _([1,2,3]).intersperse(0)
 * [1,0,2,0,3]
 */
export function intersperse(arr, sep) {
  if (arr.length === 0) {
    return [];
  }

  return arr.slice(1).reduce((output, item)=>{
    return output.concat([sep, item]);
  }, [arr[0]]);
}
