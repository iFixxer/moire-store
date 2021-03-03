export default function numberFormat(value) {
  if (!parseInt(value, 10)) {
    return 0;
  } else {
    return new Intl.NumberFormat().format(value);
  }
}
