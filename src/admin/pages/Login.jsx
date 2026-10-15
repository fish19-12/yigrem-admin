import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";

import logo from "../../assets/logo.jpg";
import { FiEye, FiEyeOff, FiLogIn, FiUserPlus, FiShield } from "react-icons/fi";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/api/auth/login", {
        username: username.trim(),
        password,
      });

      const data = response.data;

      console.log("LOGIN RESPONSE:", data);

      if (!data?.token) {
        throw new Error("No token received from server");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);

      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="yg-login-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap');

        .yg-login-page {
          --yg-wine: #542238;
          --yg-wine-dark: #351824;
          --yg-gold: #b58a45;
          --yg-gold-light: #e3c995;
          --yg-ivory: #faf7f1;
          --yg-ink: #33252a;
          --yg-muted: #82766d;

          min-height: 100vh;
          min-height: 100dvh;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(390px, .88fr);
          background: var(--yg-ivory);
          color: var(--yg-ink);
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
        }

        .yg-login-page *,
        .yg-login-page *::before,
        .yg-login-page *::after {
          box-sizing: border-box;
        }

        /* BRAND PANEL */

        .yg-login-brand-panel {
          position: relative;
          isolation: isolate;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 100vh;
          padding: 42px clamp(28px, 5vw, 76px);
          overflow: hidden;
          color: #fffaf1;
          background:
            radial-gradient(ellipse at 15% 15%, rgba(225,195,139,.18), transparent 45%),
            linear-gradient(145deg, #351824 0%, #59283a 52%, #321b25 100%);
        }

        .yg-login-brand-panel::before,
        .yg-login-brand-panel::after {
          content: "";
          position: absolute;
          z-index: -1;
          border: 1px solid rgba(227,201,149,.24);
          border-radius: 50%;
          pointer-events: none;
        }

        .yg-login-brand-panel::before {
          width: 590px;
          height: 590px;
          left: -270px;
          top: 14%;
          box-shadow:
            0 0 0 25px rgba(227,201,149,.035),
            0 0 0 52px rgba(227,201,149,.025);
        }

        .yg-login-brand-panel::after {
          width: 440px;
          height: 440px;
          right: -240px;
          bottom: -100px;
          box-shadow: 0 0 0 25px rgba(227,201,149,.035);
        }

        .yg-login-brand {
          display: flex;
          align-items: center;
          gap: 14px;
          position: relative;
          z-index: 1;
        }

        .yg-login-brand img {
          width: 56px;
          height: 56px;
          flex-shrink: 0;
          border: 2px solid rgba(227,201,149,.85);
          border-radius: 50%;
          object-fit: cover;
          box-shadow: 0 4px 24px rgba(0,0,0,.2);
        }

        .yg-login-brand h1 {
          margin: 0;
          color: #fffaf1;
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 24px;
          font-weight: 600;
          letter-spacing: .3px;
          line-height: 1.2;
        }

        .yg-login-brand p {
          margin: 6px 0 0;
          color: #dfc69e;
          font-size: 10px;
          letter-spacing: 2.6px;
          text-transform: uppercase;
        }

        .yg-login-brand-content {
          position: relative;
          z-index: 1;
          max-width: 510px;
          padding: 45px 0;
        }

        .yg-login-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 24px;
          color: var(--yg-gold-light);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
        }

        .yg-login-eyebrow::before {
          content: "";
          width: 30px;
          height: 1px;
          background: var(--yg-gold-light);
        }

        .yg-login-brand-content h2 {
          max-width: 560px;
          margin: 0;
          color: #fffaf1;
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(42px, 5vw, 68px);
          font-weight: 500;
          letter-spacing: -1.5px;
          line-height: 1.13;
        }

        .yg-login-brand-content h2 span {
          color: var(--yg-gold-light);
          font-style: italic;
        }

        .yg-login-brand-content > p {
          max-width: 390px;
          margin: 23px 0 0;
          color: rgba(255,250,241,.73);
          font-size: 14px;
          line-height: 1.9;
        }

        .yg-login-divider {
          width: 64px;
          height: 2px;
          margin: 30px 0;
          background: linear-gradient(to right, var(--yg-gold-light), transparent);
        }

        .yg-login-brand-note {
          display: flex;
          align-items: center;
          gap: 11px;
          color: rgba(255,250,241,.78);
          font-size: 12px;
        }

        .yg-login-brand-note svg {
          flex-shrink: 0;
          color: var(--yg-gold-light);
          font-size: 17px;
        }

        .yg-login-brand-footer {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding-top: 20px;
          border-top: 1px solid rgba(255,255,255,.14);
          color: rgba(255,250,241,.55);
          font-size: 10px;
          letter-spacing: .6px;
        }

        /* LOGIN FORM */

        .yg-login-form-panel {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px clamp(24px, 4vw, 66px);
          background:
            radial-gradient(ellipse at 90% 0%, rgba(227,201,149,.13), transparent 42%),
            var(--yg-ivory);
        }

        .yg-login-card {
          width: 100%;
          max-width: 405px;
        }

        .yg-login-mobile-brand {
          display: none;
        }

        .yg-login-heading {
          margin-bottom: 32px;
        }

        .yg-login-heading .yg-login-label {
          display: block;
          margin-bottom: 13px;
          color: var(--yg-gold);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2.6px;
          text-transform: uppercase;
        }

        .yg-login-heading h2 {
          margin: 0;
          color: #33252a;
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(30px, 3vw, 38px);
          font-weight: 600;
          letter-spacing: -.7px;
          line-height: 1.2;
        }

        .yg-login-heading > p {
          margin: 12px 0 0;
          color: var(--yg-muted);
          font-size: 13px;
          line-height: 1.8;
        }

        .yg-login-security-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 19px;
          padding: 9px 12px;
          border: 1px solid #eadbc1;
          border-radius: 7px;
          background: #f6efe3;
          color: #77552d;
          font-size: 11px;
          font-weight: 600;
        }

        .yg-login-field {
          margin-bottom: 21px;
        }

        .yg-login-field label {
          display: block;
          margin-bottom: 9px;
          color: #403632;
          font-size: 12px;
          font-weight: 700;
        }

        .yg-login-input-wrap {
          position: relative;
        }

        .yg-login-input {
          display: block;
          width: 100%;
          height: 53px;
          padding: 0 15px;
          border: 1px solid #e7ded2;
          border-radius: 10px;
          outline: none;
          background: rgba(255,255,255,.82);
          color: #302723;
          font-family: inherit;
          font-size: 13px;
          transition: border-color .2s, box-shadow .2s, background .2s;
        }

        .yg-login-input::placeholder {
          color: #b0a69b;
        }

        .yg-login-input:focus {
          border-color: var(--yg-gold);
          background: #fff;
          box-shadow: 0 0 0 4px rgba(181,138,69,.11);
        }

        .yg-login-password-input {
          padding-right: 48px;
        }

        .yg-login-eye {
          position: absolute;
          top: 50%;
          right: 10px;
          display: grid;
          place-items: center;
          width: 32px;
          height: 34px;
          transform: translateY(-50%);
          border: 0;
          border-radius: 6px;
          background: transparent;
          color: #8d8075;
          cursor: pointer;
          font-size: 17px;
        }

        .yg-login-eye:hover {
          background: #f7f0e8;
          color: var(--yg-wine);
        }

        .yg-login-error {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 22px;
          padding: 12px 13px;
          border: 1px solid #f2d0cb;
          border-radius: 9px;
          background: #fff0ef;
          color: #a33131;
          font-size: 12px;
          line-height: 1.6;
          overflow-wrap: anywhere;
        }

        .yg-login-error svg {
          flex-shrink: 0;
          margin-top: 2px;
        }

        .yg-login-submit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          min-height: 53px;
          margin-top: 7px;
          padding: 14px 18px;
          border: 0;
          border-radius: 10px;
          background: linear-gradient(110deg, #6b293f, #4b1d30);
          color: #fffaf1;
          font-family: inherit;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: .3px;
          cursor: pointer;
          box-shadow: 0 8px 20px rgba(79,30,48,.16);
          transition: transform .2s, box-shadow .2s, opacity .2s;
        }

        .yg-login-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 25px rgba(79,30,48,.23);
        }

        .yg-login-submit:disabled {
          opacity: .65;
          cursor: not-allowed;
        }

        .yg-login-register {
          margin-top: 28px;
          padding-top: 22px;
          border-top: 1px solid #eae1d6;
          text-align: center;
        }

        .yg-login-register p {
          margin: 0 0 12px;
          color: #8b7e73;
          font-size: 12px;
        }

        .yg-login-register a {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          color: #71334a;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          transition: color .2s;
        }

        .yg-login-register a:hover {
          color: var(--yg-gold);
        }

        .yg-login-privacy {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          margin-top: 32px;
          color: #a3998e;
          font-size: 10px;
        }

        .yg-login-privacy svg {
          color: #a88954;
          font-size: 13px;
        }

        /* RESPONSIVE */

        @media (min-width: 1500px) {
          .yg-login-brand-panel {
            padding-left: max(76px, calc((100vw - 1500px) / 2));
          }
        }

        @media (max-width: 900px) {
          .yg-login-page {
            grid-template-columns: minmax(0, .9fr) minmax(360px, 1.1fr);
          }

          .yg-login-brand-panel {
            padding: 34px 28px;
          }

          .yg-login-brand h1 {
            font-size: 20px;
          }

          .yg-login-brand-content h2 {
            font-size: clamp(38px, 5vw, 52px);
          }

          .yg-login-form-panel {
            padding: 32px 25px;
          }
        }

        @media (max-width: 680px) {
          .yg-login-page {
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 28px 20px;
            background:
              radial-gradient(ellipse at 90% 0%, rgba(227,201,149,.17), transparent 42%),
              var(--yg-ivory);
          }

          .yg-login-brand-panel {
            display: none;
          }

          .yg-login-form-panel {
            display: block;
            width: 100%;
            padding: 0;
            background: transparent;
          }

          .yg-login-card {
            max-width: 420px;
            margin: 0 auto;
          }

          .yg-login-mobile-brand {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            margin-bottom: 37px;
          }

          .yg-login-mobile-brand img {
            width: 57px;
            height: 57px;
            border: 2px solid #c4a266;
            border-radius: 50%;
            object-fit: cover;
          }

          .yg-login-mobile-brand h1 {
            margin: 0;
            color: #59283a;
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 23px;
            font-weight: 600;
          }

          .yg-login-mobile-brand p {
            margin: 5px 0 0;
            color: #9b7b4b;
            font-size: 9px;
            letter-spacing: 2px;
            text-transform: uppercase;
          }

          .yg-login-heading {
            margin-bottom: 28px;
          }

          .yg-login-heading h2 {
            font-size: 34px;
          }

          .yg-login-privacy {
            margin-top: 28px;
          }
        }

        @media (max-width: 380px) {
          .yg-login-page {
            padding: 25px 16px;
          }

          .yg-login-mobile-brand {
            margin-bottom: 30px;
          }

          .yg-login-heading h2 {
            font-size: 30px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .yg-login-page *,
          .yg-login-page *::before,
          .yg-login-page *::after {
            transition: none !important;
          }
        }
      `}</style>

      {/* LEFT: YIGERMAL BRAND PANEL */}
      <section className="yg-login-brand-panel">
        <div className="yg-login-brand">
          <img src={logo} alt="Yigermal Design logo" />

          <div>
            <h1>Yigermal Design</h1>
            <p>Tradition Meets Elegance</p>
          </div>
        </div>

        <div className="yg-login-brand-content">
          <div className="yg-login-eyebrow">Crafted with Elegance</div>

          <h2>
            Beauty in Every
            <br />
            <span>Detail.</span>
          </h2>

          <p>
            Welcome to your exclusive administration space. Manage your fashion
            business, organize your operations, and bring your vision of
            timeless Ethiopian elegance to life.
          </p>

          <div className="yg-login-divider" />

          <div className="yg-login-brand-note">
            <FiShield />
            <span>A dedicated space for your business management</span>
          </div>
        </div>

        <div className="yg-login-brand-footer">
          <span>YIGERMAL DESIGN</span>
          <span>TIMELESS · ELEGANT · UNIQUE</span>
        </div>
      </section>

      {/* RIGHT: LOGIN FORM */}
      <main className="yg-login-form-panel">
        <div className="yg-login-card">
          {/* MOBILE BRAND */}
          <div className="yg-login-mobile-brand">
            <img src={logo} alt="Yigermal Design logo" />

            <div>
              <h1>Yigermal Design</h1>
              <p>Tradition Meets Elegance</p>
            </div>
          </div>

          {/* FORM HEADING */}
          <div className="yg-login-heading">
            <span className="yg-login-label">Administrator Access</span>

            <h2>Welcome back.</h2>

            <p>Sign in to access your dashboard and manage your business.</p>

            <div className="yg-login-security-badge">
              <FiShield />
              Secure Admin Access
            </div>
          </div>

          <form onSubmit={handleLogin}>
            {/* ERROR MESSAGE */}
            {error && (
              <div className="yg-login-error" role="alert">
                <FiShield />
                <span>{error}</span>
              </div>
            )}

            {/* USERNAME */}
            <div className="yg-login-field">
              <label htmlFor="yg-login-username">Username</label>

              <input
                id="yg-login-username"
                className="yg-login-input"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="yg-login-field">
              <label htmlFor="yg-login-password">Password</label>

              <div className="yg-login-input-wrap">
                <input
                  id="yg-login-password"
                  className="yg-login-input yg-login-password-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="yg-login-eye"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="yg-login-submit"
              disabled={loading}
            >
              {loading ? (
                "Signing in..."
              ) : (
                <>
                  <FiLogIn />
                  Sign In to Dashboard
                </>
              )}
            </button>
          </form>

          {/* REGISTRATION LINK */}
          <div className="yg-login-register">
            <p>Need a new admin account?</p>

            <Link to="/register">
              <FiUserPlus />
              Create Admin Account
            </Link>
          </div>

          <div className="yg-login-privacy">
            <FiShield />
            <span>Authorized administrators only</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
