/** Keep result wording intact while making signed amounts stand out. */
export default function EmphasizeNumbers({ text }) {
  return String(text ?? '').split(/([+−-]?\d+(?:[.,]\d+)*%?)/g).map((part, index) =>
    index % 2 ? <strong className="result-number" key={index}>{part}</strong> : part
  );
}
