export const getCurrentDatetime = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month =
    date.getMonth() < 10
      ? `0${(date.getMonth() + 1).toString()}`
      : date.getMonth();
  const day =
    date.getDate() < 10
      ? `0${(date.getDate() + 1).toString()}`
      : date.getDate();

  const hour =
    date.getHours() < 10
      ? `0${(date.getHours() + 1).toString()}`
      : date.getHours();
  const minute =
    date.getMinutes() < 10
      ? `0${(date.getMinutes() + 1).toString()}`
      : date.getMinutes();
  const second =
    date.getSeconds() < 10
      ? `0${(date.getSeconds() + 1).toString()}`
      : date.getSeconds();

  const datetime = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

  return datetime;
};

export const formatDatetime = (datetime) => {
  const date = new Date(datetime);

  const year = date.getFullYear();
  const month =
    date.getMonth() < 10
      ? `0${(date.getMonth() + 1).toString()}`
      : date.getMonth();
  const day =
    date.getDate() < 10
      ? `0${(date.getDate() + 1).toString()}`
      : date.getDate();

  const hour =
    date.getHours() < 10
      ? `0${(date.getHours() + 1).toString()}`
      : date.getHours();
  const minute =
    date.getMinutes() < 10
      ? `0${(date.getMinutes() + 1).toString()}`
      : date.getMinutes();
  const second =
    date.getSeconds() < 10
      ? `0${(date.getSeconds() + 1).toString()}`
      : date.getSeconds();

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};
