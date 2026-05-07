export default function TrailerBox({ url }) {
  return (
    <div className="trailer-box">
      <p className="small">Трейлэрийг холбоосоор нээнэ.</p>
      <div className="action-row">
        <a
          href={url}
          className="button"
          target="_blank"
          rel="noopener noreferrer"
        >
          YouTube дээр нээх
        </a>
      </div>
    </div>
  );
}
