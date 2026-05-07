export default function ReviewList({ reviews }) {
  if (!reviews || reviews.length === 0) return <p>Сэтгэгдэл байхгүй</p>;
  return (
    <div className="review-list">
      {reviews.map((r, idx) => (
        <div className="review-item" key={idx}>
          <div className="review-meta">
            <span className="avatar">{r.avatar}</span>
            <strong>{r.name}</strong>
            <span className="badge">{r.rating} / 5</span>
            <span className="small">{r.date}</span>
          </div>
          <p className="small top-gap">{r.comment}</p>
        </div>
      ))}
    </div>
  );
}
