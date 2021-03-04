export default function numberFormat(value) {
  if (!parseInt(value, 10)) {
    return 0;
  }
  return new Intl.NumberFormat().format(value);
}
