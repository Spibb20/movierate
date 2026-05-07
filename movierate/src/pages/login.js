import Header from "../components/Header";
import Footer from "../components/Footer";

export default function LoginPage() {
  return (
    <>
      <Header />
      <div className="page section">
        <div
          className="form-box card-pad"
          style={{ maxWidth: "30rem", margin: "0 auto" }}
        >
          <h1>Нэвтрэх</h1>
          <form>
            <div className="field">
              <label htmlFor="email">И-мэйл</label>
              <input type="text" id="email" name="email" />
            </div>
            <div className="field">
              <label htmlFor="password">Нууц үг</label>
              <input type="password" id="password" name="password" />
            </div>
            <div className="action-row">
              <button type="submit" className="button">
                Нэвтрэх
              </button>
              <a href="/register" className="ghost-button">
                Бүртгүүлэх
              </a>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
