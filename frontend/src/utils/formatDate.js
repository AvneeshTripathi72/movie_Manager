import dayjs from 'dayjs';

export const formatDate = (value, format = 'MMM D, YYYY') => {
  if (!value) {
    return 'N/A';
  }
  const parsed = dayjs(value);
  if (!parsed.isValid()) {
    return 'N/A';
  }
  return parsed.format(format);
};
