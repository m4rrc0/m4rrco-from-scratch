export default {
  color: function(prop, val) {
    console.log({ prop, val });
    return 'orange';
  },
  sizeScaleRatio: (baseSize = 16, maxSize = 100, steps = 12) =>
    (maxSize / baseSize) ** (1 / steps),
  lock: (lockMin, lockMax, lockScreenMin, lockScreenMax) => `calc(
        (${lockMin} * 1rem) +
        (${lockMax} - ${lockMin}) *
        (100vw - (${lockScreenMin} * 1rem)) /
        (${lockScreenMax} - ${lockScreenMin})
      )`,
};
