export default {
  border: function(mixin, path) {
    console.log({ mixin, path });
    return {
      div: {
        border: 'solid 2px currentcolor',
      },
    };
  },
};
