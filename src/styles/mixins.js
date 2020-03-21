export default {
  border: function(mixin, path) {
    // console.log({ mixin, path });
    return {
      div: {
        border: 'solid 2px currentcolor',
      },
    };
  },
  locks: (mixin, ...attrs) => {
    // console.log({ mixin, attrs });
    // const { start, input, end } = mixin.source;
    // console.log({ start, input, end });
    const o = {};
    attrs.forEach(attr => {
      const key = `--lock${attr === 'lock' ? '' : `-${attr}`}`;
      o[
        key
      ] = `calc((var(--size-${attr}-min) * 1rem) + (var(--size-${attr}-max) - var(--size-${attr}-min)) * (100vw - (var(--size-lock-screen-min) * 1rem)) / (var(--size-lock-screen-max) - var(--size-lock-screen-min)))`;
    });
    return o;
  },
};
