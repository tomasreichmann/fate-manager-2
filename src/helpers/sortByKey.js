export default (key) => {
  return (itemA, itemB) => {
    const itemAVal = itemA.get(key);
    const itemBVal = itemB.get(key);
    if (itemAVal < itemBVal) { return -1; }
    if (itemAVal > itemBVal) { return 1; }
    if (itemAVal === itemBVal) { return 0; }
  };
};
