import Link from "next/link";

export default function Header() {
  return (
    <header className="topbar">
      <div className="topbar-inner page">
        <div className="brand">
          <span className="brand-mark"></span>
          <Link href="/">MovieRate</Link>
        </div>
        <nav className="nav">
          <Link href="/">Нүүр</Link>
          <Link href="/movies">Төрлөөр хайх</Link>
          <Link href="/login">Нэвтрэх</Link>
          <Link href="/profile" className="cta">
            Профайл
          </Link>
        </nav>
      </div>
    </header>
  );
}
