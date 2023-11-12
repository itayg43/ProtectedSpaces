const debug = (d: any) => {
  if (__DEV__) {
    console.debug(d);
  }
};

const error = (e: any) => {
  if (__DEV__) {
    console.error(e);
  }
};

export default {
  debug,
  error,
};
