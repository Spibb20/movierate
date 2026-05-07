import Header from "../components/Header";
import Footer from "../components/Footer";

export default function RegisterPage() {
  return (
    <>
      <Header />
      <div className="page section">
        <div
          className="form-box card-pad"
          style={{ maxWidth: "34rem", margin: "0 auto" }}
        >
          <h1>Бүртгүүлэх</h1>
          <form>
            <div className="field">
              <label htmlFor="reg-name">Нэр</label>
              <input type="text" id="reg-name" name="reg-name" />
            </div>
            <div className="field">
              <label htmlFor="reg-email">И-мэйл</label>
              <input type="text" id="reg-email" name="reg-email" />
            </div>
            <div className="field">
              <label htmlFor="reg-pass">Нууц үг</label>
              <input type="password" id="reg-pass" name="reg-pass" />
            </div>
            <div className="field">
              <label htmlFor="reg-confirm">Нууц үг давтах</label>
              <input type="password" id="reg-confirm" name="reg-confirm" />
            </div>
            <div className="action-row">
              <button type="submit" className="button">
                Бүртгүүлэх
              </button>
              <a href="/login" className="ghost-button">
                Нэвтрэх
              </a>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
