export function capitalizeFirstLetter(string) {
  const str = String(string);
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function seq(count) {
  return Array(count).fill(null).map( (item, index)=>( index ) );
}

export function sortByKey(key) {
  return (itemA, itemB) => {
    const normalizedA = itemA.get ? itemA.toJS() : itemA;
    const normalizedB = itemB.get ? itemB.toJS() : itemB;
    if (normalizedA[key] < normalizedB[key]) { return -1; }
    if (normalizedA[key] > normalizedB[key]) { return 1; }
    if (normalizedA[key] === normalizedB[key]) { return 0; }
  };
}

export function isEmail(email) {
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
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

export function resolveAccess(document, uid) {
  const isPublic = document.get('access') === undefined
    || !!document.getIn(['access', 'isPublic']);
  const isAuthor = document.get('createdBy') === uid;

  // TODO: remove after trial period
  if ((document.get('sharing') === 'private' || document.get('private') === true) && document.get('access') === undefined) {
    return isAuthor;
  }
  return isAuthor
    || (isPublic && !document.getIn(['access', 'exceptions', uid]))
    || (!isPublic && document.getIn(['access', 'exceptions', uid]));
}

export function hasLimitedAccess(document) {
  // TODO: remove after trial period
  if ((document.get('sharing') === 'private' || document.get('private') === true) && document.get('access') === undefined) {
    return true;
  }

  const exceptions = document.getIn(['access', 'exceptions']) || new Map();
  const isPublic = document.get('access') === undefined
    || !!document.getIn(['access', 'isPublic']);
  return exceptions.size > 0 || !isPublic;
}
