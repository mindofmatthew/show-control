const LENGTH = 6;

exports.genId = () => {
  return Math.floor(Math.random() * 16 ** LENGTH)
    .toString(16)
    .padStart(LENGTH, '0');
};
