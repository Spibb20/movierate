import { useRouter } from "next/router";
import { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import MovieDetail from "../../components/MovieDetail";
import TrailerBox from "../../components/TrailerBox";
import ReviewList from "../../components/ReviewList";
import moviesData from "../../data/movies.json";

export default function MoviePage() {
  const router = useRouter();
  const { id } = router.query;
  const movie = moviesData.find((m) => m.id === parseInt(id, 10));

  const [reviews, setReviews] = useState(movie?.reviews || []);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newReview = {
      avatar: comment.slice(0, 2).toUpperCase(),
      name: "Anonymous",
      rating,
      date: new Date().toISOString().split("T")[0],
      comment,
    };
    setReviews([...reviews, newReview]);
    setComment("");
    setRating(5);
  };

  if (!movie) return <p>Кино олдсонгүй</p>;

  return (
    <>
      <Header />
      <MovieDetail movie={movie} />
      <TrailerBox url={movie.trailer} />
      <div className="page section">
        <h2>Сэтгэгдэл ({reviews.length})</h2>
        <div className="two-col">
          <div className="review-box card-pad">
            <h3>Үнэлгээ өгөх</h3>
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label>Оноо</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(parseInt(e.target.value, 10))}
                >
                  {[5, 4, 3, 2, 1].map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Сэтгэгдэл</label>
                <textarea
                  rows={6}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>
              <div className="action-row">
                <button type="submit" className="button">
                  Илгээх
                </button>
              </div>
            </form>
          </div>
          <ReviewList reviews={reviews} />
        </div>
      </div>
      <Footer />
    </>
  );
}
