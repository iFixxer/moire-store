export default function numberFormat(value) {
  if (!parseInt(value)) {
    return 0;
  } else {
    return new Intl.NumberFormat().format(value);
  }
}
