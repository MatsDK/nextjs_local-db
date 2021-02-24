const helper = (path) => {
  switch (path) {
    case "/":
      return 0;
    case "/status":
      return 1;
    case "/requests":
      return 2;

    case "/locations":
      return 3;
    default:
      return 4;
  }
};

export default helper;
