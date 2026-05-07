import Header from "../components/Header";
import Footer from "../components/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <div className="page hero">
        <div className="hero-wrap">
          <span className="eyebrow">Кино мэдээлэл & үнэлгээ</span>
          <h1>
            Шилдэг кинонуудыг олж, <span>үнэлгээ</span> өгөөрэй
          </h1>
        </div>
      </div>
      <Footer />
    </>
  );
}
