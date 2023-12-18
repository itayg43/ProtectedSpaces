const arrayByKey = <T, K extends keyof T>(array: T[], key: K) => {
  return array.reduce((prev, currItem) => {
    const currKeyValue = currItem[key] as string | number;
    return {
      ...prev,
      [currKeyValue]: currItem,
    };
  }, {});
};

export default {
  arrayByKey,
};
