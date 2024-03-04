export const formatDatetime = (datetime) => {
  const arr = datetime.split(' ');

  if (arr[1].slice(0, 2) >= 12 && arr[1].slice(0, 2) <= 23) {
    arr[1] += ' PM';

    return arr;
  } else {
    arr[1] += ' AM';

    return arr;
  }
};
