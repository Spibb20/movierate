import Link from "next/link";
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-wrap page">
        <div>
          <div className="brand">
            <span className="brand-mark"></span>
            <span className="brand-word">MovieRate</span>
          </div>
          <p className="small top-gap">
            Кино мэдээлэл, үнэлгээ, трейлэрийн холбоос, сэтгэгдэл.
          </p>
        </div>
        <div className="footer-links">
          <h3>Хуудсууд</h3>
          <Link href="/">Нүүр</Link>
          <Link href="/movies">Кино жагсаалт</Link>
          <Link href="/profile">Профайл</Link>
        </div>
      </div>
      <div className="copyright page">© 2024 MovieRate.mn</div>
    </footer>
  );
}
