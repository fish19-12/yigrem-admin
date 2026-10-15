import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../services/api";
import logo from "../../assets/logo.jpg";

import {
  FiEye,
  FiEyeOff,
  FiShield,
  FiUser,
  FiLock,
  FiArrowRight,
  FiCheckCircle,
} from "react-icons/fi";

const Register = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [adminKey, setAdminKey] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showAdminKey, setShowAdminKey] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await api.post("/api/auth/register", {
        username: username.trim(),
        password,
        adminKey,
      });

      const data = response.data;

      console.log("REGISTER RESPONSE:", data);

      if (!data?.token) {
        throw new Error("No token received from server");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);

      setSuccess(data.message || "Admin created successfully!");

      setUsername("");
      setPassword("");
      setAdminKey("");

      setTimeout(() => {
        navigate("/admin/dashboard", { replace: true });
      }, 1200);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Registration failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="yg-register-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap');

        .yg-register-page {
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
          grid-template-columns: minmax(0, 1fr) minmax(400px, .88fr);
          background: var(--yg-ivory);
          color: var(--yg-ink);
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
        }

        .yg-register-page *,
        .yg-register-page *::before,
        .yg-register-page *::after {
          box-sizing: border-box;
        }

        .yg-register-brand-panel {
          position: relative;
          isolation: isolate;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 42px clamp(28px, 5vw, 76px);
          overflow: hidden;
          color: #fffaf1;
          background:
            radial-gradient(ellipse at 15% 15%, rgba(225,195,139,.18), transparent 45%),
            linear-gradient(145deg, #351824 0%, #59283a 52%, #321b25 100%);
        }

        .yg-register-brand-panel::before,
        .yg-register-brand-panel::after {
          content: "";
          position: absolute;
          z-index: -1;
          border: 1px solid rgba(227,201,149,.24);
          border-radius: 50%;
          pointer-events: none;
        }

        .yg-register-brand-panel::before {
          width: 590px;
          height: 590px;
          left: -270px;
          top: 14%;
          box-shadow:
            0 0 0 25px rgba(227,201,149,.035),
            0 0 0 52px rgba(227,201,149,.025);
        }

        .yg-register-brand-panel::after {
          width: 440px;
          height: 440px;
          right: -240px;
          bottom: -100px;
          box-shadow: 0 0 0 25px rgba(227,201,149,.035);
        }

        .yg-register-brand {
          display: flex;
          align-items: center;
          gap: 14px;
          position: relative;
          z-index: 1;
        }

        .yg-register-brand img {
          width: 56px;
          height: 56px;
          flex-shrink: 0;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid rgba(227,201,149,.85);
          box-shadow: 0 4px 24px rgba(0,0,0,.2);
        }

        .yg-register-brand h1 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 24px;
          line-height: 1.2;
          font-weight: 600;
          letter-spacing: .3px;
          margin: 0;
          color: #fffaf1;
        }

        .yg-register-brand p {
          margin: 6px 0 0;
          color: #dfc69e;
          font-size: 10px;
          letter-spacing: 2.6px;
          text-transform: uppercase;
        }

        .yg-register-brand-content {
          max-width: 500px;
          position: relative;
          z-index: 1;
          padding: 45px 0;
        }

        .yg-register-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: var(--yg-gold-light);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 24px;
        }

        .yg-register-eyebrow::before {
          content: "";
          width: 30px;
          height: 1px;
          background: var(--yg-gold-light);
        }

        .yg-register-brand-content h2 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(42px, 5vw, 68px);
          font-weight: 500;
          line-height: 1.13;
          letter-spacing: -1.5px;
          margin: 0;
        }

        .yg-register-brand-content h2 span {
          color: var(--yg-gold-light);
          font-style: italic;
        }

        .yg-register-brand-content > p {
          max-width: 390px;
          margin: 23px 0 0;
          color: rgba(255,250,241,.73);
          font-size: 14px;
          line-height: 1.9;
        }

        .yg-register-divider {
          width: 64px;
          height: 2px;
          margin: 30px 0;
          background: linear-gradient(to right, var(--yg-gold-light), transparent);
        }

        .yg-register-brand-note {
          display: flex;
          align-items: center;
          gap: 11px;
          color: rgba(255,250,241,.78);
          font-size: 12px;
        }

        .yg-register-brand-note svg {
          color: var(--yg-gold-light);
          font-size: 17px;
          flex-shrink: 0;
        }

        .yg-register-brand-footer {
          position: relative;
          z-index: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          padding-top: 20px;
          border-top: 1px solid rgba(255,255,255,.14);
          color: rgba(255,250,241,.55);
          font-size: 10px;
          letter-spacing: .6px;
        }

        .yg-register-form-panel {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px clamp(24px, 4vw, 66px);
          background:
            radial-gradient(ellipse at 90% 0%, rgba(227,201,149,.13), transparent 42%),
            var(--yg-ivory);
        }

        .yg-register-card {
          width: 100%;
          max-width: 405px;
        }

        .yg-register-mobile-brand {
          display: none;
        }

        .yg-register-heading {
          margin-bottom: 27px;
        }

        .yg-register-heading .yg-register-label {
          display: block;
          margin-bottom: 13px;
          color: var(--yg-gold);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2.6px;
          text-transform: uppercase;
        }

        .yg-register-heading h2 {
          margin: 0;
          color: #33252a;
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(30px, 3vw, 38px);
          font-weight: 600;
          letter-spacing: -.7px;
          line-height: 1.2;
        }

        .yg-register-heading p {
          margin: 12px 0 0;
          color: var(--yg-muted);
          font-size: 13px;
          line-height: 1.8;
        }

        .yg-register-security-badge {
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

        .yg-register-alert {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 18px;
          padding: 12px 13px;
          border-radius: 9px;
          font-size: 12px;
          line-height: 1.6;
          overflow-wrap: anywhere;
        }

        .yg-register-alert svg {
          flex-shrink: 0;
          margin-top: 2px;
        }

        .yg-register-alert-error {
          color: #a33131;
          background: #fff0ef;
          border: 1px solid #f2d0cb;
        }

        .yg-register-alert-success {
          color: #276548;
          background: #edf8f0;
          border: 1px solid #cde9d5;
        }

        .yg-register-alert-title {
          font-size: 12px;
          font-weight: 700;
          margin: 0 0 2px;
        }

        .yg-register-alert-text {
          margin: 0;
          font-size: 12px;
        }

        .yg-register-field {
          margin-bottom: 17px;
        }

        .yg-register-field label {
          display: block;
          margin-bottom: 8px;
          color: #403632;
          font-size: 12px;
          font-weight: 700;
        }

        .yg-register-input-wrap {
          position: relative;
        }

        .yg-register-input-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #a18e7c;
          font-size: 16px;
          pointer-events: none;
        }

        .yg-register-input {
          display: block;
          width: 100%;
          height: 51px;
          padding: 0 47px 0 43px;
          border: 1px solid #e7ded2;
          border-radius: 9px;
          background: rgba(255,255,255,.82);
          color: #302723;
          font-family: inherit;
          font-size: 13px;
          outline: none;
          transition: border-color .2s, box-shadow .2s, background .2s;
        }

        .yg-register-input::placeholder {
          color: #b0a69b;
        }

        .yg-register-input:focus {
          border-color: var(--yg-gold);
          background: #fff;
          box-shadow: 0 0 0 4px rgba(181,138,69,.11);
        }

        .yg-register-eye {
          position: absolute;
          top: 50%;
          right: 10px;
          transform: translateY(-50%);
          display: grid;
          place-items: center;
          width: 32px;
          height: 34px;
          border: 0;
          border-radius: 6px;
          background: transparent;
          color: #8d8075;
          cursor: pointer;
          font-size: 17px;
        }

        .yg-register-eye:hover {
          background: #f7f0e8;
          color: var(--yg-wine);
        }

        .yg-register-submit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          min-height: 52px;
          margin-top: 7px;
          padding: 14px 18px;
          border: 0;
          border-radius: 9px;
          background: linear-gradient(110deg, #6b293f, #4b1d30);
          color: #fffaf1;
          font-family: inherit;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: .2px;
          cursor: pointer;
          box-shadow: 0 8px 20px rgba(79,30,48,.16);
          transition: transform .2s, box-shadow .2s, opacity .2s;
        }

        .yg-register-submit:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 25px rgba(79,30,48,.23);
        }

        .yg-register-submit:disabled {
          opacity: .65;
          cursor: not-allowed;
        }

        .yg-register-footer {
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid #eae1d6;
          text-align: center;
        }

        .yg-register-footer p {
          margin: 0 0 11px;
          color: #8b7e73;
          font-size: 12px;
        }

        .yg-register-login-link {
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

        .yg-register-login-link:hover {
          color: var(--yg-gold);
        }

        .yg-register-privacy {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 7px;
          margin-top: 27px;
          color: #a3998e;
          font-size: 10px;
        }

        .yg-register-privacy svg {
          color: #a88954;
          font-size: 13px;
        }

        @media (min-width: 1500px) {
          .yg-register-brand-panel {
            padding-left: max(76px, calc((100vw - 1500px) / 2));
          }
        }

        @media (max-width: 900px) {
          .yg-register-page {
            grid-template-columns: minmax(0, .9fr) minmax(360px, 1.1fr);
          }

          .yg-register-brand-panel {
            padding: 34px 28px;
          }

          .yg-register-brand h1 {
            font-size: 20px;
          }

          .yg-register-brand-content h2 {
            font-size: clamp(38px, 5vw, 52px);
          }

          .yg-register-form-panel {
            padding: 32px 25px;
          }
        }

        @media (max-width: 680px) {
          .yg-register-page {
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 27px 20px;
            background:
              radial-gradient(ellipse at 90% 0%, rgba(227,201,149,.17), transparent 42%),
              var(--yg-ivory);
          }

          .yg-register-brand-panel {
            display: none;
          }

          .yg-register-form-panel {
            display: block;
            width: 100%;
            padding: 0;
            background: transparent;
          }

          .yg-register-card {
            max-width: 420px;
            margin: 0 auto;
          }

          .yg-register-mobile-brand {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 12px;
            margin-bottom: 32px;
          }

          .yg-register-mobile-brand img {
            width: 55px;
            height: 55px;
            object-fit: cover;
            border: 2px solid #c4a266;
            border-radius: 50%;
          }

          .yg-register-mobile-brand h1 {
            margin: 0;
            color: #59283a;
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 22px;
            font-weight: 600;
          }

          .yg-register-mobile-brand p {
            margin: 5px 0 0;
            color: #9b7b4b;
            font-size: 9px;
            letter-spacing: 2px;
            text-transform: uppercase;
          }

          .yg-register-heading h2 {
            font-size: 33px;
          }

          .yg-register-privacy {
            margin-top: 25px;
          }
        }

        @media (max-width: 380px) {
          .yg-register-page {
            padding: 24px 15px;
          }

          .yg-register-mobile-brand {
            margin-bottom: 27px;
          }

          .yg-register-heading h2 {
            font-size: 29px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .yg-register-page *,
          .yg-register-page *::before,
          .yg-register-page *::after {
            transition: none !important;
          }
        }
      `}</style>

      {/* BRAND PANEL */}
      <section className="yg-register-brand-panel">
        <div className="yg-register-brand">
          <img src={logo} alt="Yigermal logo" />

          <div>
            <h1>Yigermal</h1>
            <p>Tradition Meets Elegance</p>
          </div>
        </div>

        <div className="yg-register-brand-content">
          <div className="yg-register-eyebrow">Crafted with Elegance</div>

          <h2>
            A New Chapter
            <br />
            <span>Begins Here.</span>
          </h2>

          <p>
            Create your administrator account and step into your dedicated
            business management space. Keep your operations organized with an
            experience inspired by Ethiopian elegance.
          </p>

          <div className="yg-register-divider" />

          <div className="yg-register-brand-note">
            <FiShield />
            <span>Secure access for authorized administrators</span>
          </div>
        </div>

        <div className="yg-register-brand-footer">
          <span>YIGERMAL</span>
          <span>TIMELESS · ELEGANT · UNIQUE</span>
        </div>
      </section>

      {/* REGISTRATION FORM */}
      <main className="yg-register-form-panel">
        <div className="yg-register-card">
          <div className="yg-register-mobile-brand">
            <img src={logo} alt="Yigermal logo" />

            <div>
              <h1>Yigermal</h1>
              <p>Tradition Meets Elegance</p>
            </div>
          </div>

          <div className="yg-register-heading">
            <span className="yg-register-label">
              Administrator Registration
            </span>

            <h2>Create your account.</h2>

            <p>
              Set up your admin credentials to access the management dashboard.
            </p>

            <div className="yg-register-security-badge">
              <FiShield />
              Secure Admin Access
            </div>
          </div>

          <form onSubmit={handleRegister}>
            {/* SUCCESS MESSAGE */}
            {success && (
              <div
                className="yg-register-alert yg-register-alert-success"
                role="status"
              >
                <FiCheckCircle />

                <div>
                  <p className="yg-register-alert-title">Success</p>
                  <p className="yg-register-alert-text">{success}</p>
                </div>
              </div>
            )}

            {/* ERROR MESSAGE */}
            {error && (
              <div
                className="yg-register-alert yg-register-alert-error"
                role="alert"
              >
                <FiShield />
                <span>{error}</span>
              </div>
            )}

            {/* USERNAME */}
            <div className="yg-register-field">
              <label htmlFor="yg-register-username">Username</label>

              <div className="yg-register-input-wrap">
                <FiUser className="yg-register-input-icon" />

                <input
                  id="yg-register-username"
                  type="text"
                  placeholder="Choose a username"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="yg-register-input"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="yg-register-field">
              <label htmlFor="yg-register-password">Password</label>

              <div className="yg-register-input-wrap">
                <FiLock className="yg-register-input-icon" />

                <input
                  id="yg-register-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="yg-register-input"
                />

                <button
                  type="button"
                  className="yg-register-eye"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* ADMIN SECRET KEY */}
            <div className="yg-register-field">
              <label htmlFor="yg-register-admin-key">Admin Secret Key</label>

              <div className="yg-register-input-wrap">
                <FiShield className="yg-register-input-icon" />

                <input
                  id="yg-register-admin-key"
                  type={showAdminKey ? "text" : "password"}
                  placeholder="Enter your admin secret key"
                  autoComplete="off"
                  required
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  className="yg-register-input"
                />

                <button
                  type="button"
                  className="yg-register-eye"
                  onClick={() => setShowAdminKey(!showAdminKey)}
                  aria-label={
                    showAdminKey
                      ? "Hide admin secret key"
                      : "Show admin secret key"
                  }
                  aria-pressed={showAdminKey}
                >
                  {showAdminKey ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* CREATE ADMIN */}
            <button
              type="submit"
              disabled={loading}
              className="yg-register-submit"
            >
              {loading ? (
                "Creating Admin..."
              ) : (
                <>
                  Create Admin Account
                  <FiArrowRight />
                </>
              )}
            </button>
          </form>

          {/* LOGIN LINK */}
          <div className="yg-register-footer">
            <p>Already have an admin account?</p>

            <Link to="/login" className="yg-register-login-link">
              Go To Login
              <FiArrowRight />
            </Link>
          </div>

          <div className="yg-register-privacy">
            <FiShield />
            <span>Authorized administrators only</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
