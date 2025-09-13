import { useState } from "react";
import { useTranslation } from "react-i18next";

interface SignupPopupProps {
  emailPrefill?: string;
  onClose: () => void;
}

export default function SignupPopup({ emailPrefill = "", onClose }: SignupPopupProps) {
  const { t } = useTranslation();
  const [preferredName, setPreferredName] = useState(""); // New state
  const [email, setEmail] = useState(emailPrefill);
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  };

  const handleSignup = async () => {
    setError("");
    setSuccess("");

    if (!preferredName.trim()) {
      setError(t("Please enter your preferred name."));
      return;
    }
    if (!validateEmail(email)) {
      setError(t("Please enter a valid email address."));
      return;
    }
    if (!password || password.length < 8) {
      setError(t("Password must be at least 8 characters."));
      return;
    }
    if (password !== password2) {
      setError(t("Passwords do not match."));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: preferredName, email, password }), // send preferredName too
      });

      const result = await res.json();

      if (res.ok) {
        setSuccess(t("Sign up successful! Redirecting to login..."));
        localStorage.setItem("signupEmailPrefill", email);
        setTimeout(() => {
          setLoading(false);
          onClose();
          window.location.href = "/login";
        }, 1500);
      } else {
        setLoading(false);
        setError(result.message || t("Signup failed."));
      }
    } catch (err) {
      setLoading(false);
      setError(t("Network error. Please try again."));
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "rgba(0,0,0,0.18)" }}>
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">{t("Create Account")}</h2>

        {/* Preferred Name field */}
        <div className="mb-4 w-full">
          <label className="block mb-2 font-semibold">{t("Preferred Name")}</label>
          <input
            type="text"
            value={preferredName}
            onChange={e => setPreferredName(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            placeholder={t("Enter your preferred name")}
          />
        </div>

        {/* Email field */}
        <div className="mb-4 w-full">
          <label className="block mb-2 font-semibold">{t("Email Address")}</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            placeholder={t("Email Address")}
            autoFocus
          />
        </div>

        {/* Password field */}
        <div className="mb-4 w-full">
          <label className="block mb-2 font-semibold">{t("Password")}</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            placeholder={t("Enter password")}
          />
        </div>

        {/* Re-enter password field */}
        <div className="mb-4 w-full">
          <label className="block mb-2 font-semibold">{t("Re-enter Password")}</label>
          <input
            type="password"
            value={password2}
            onChange={e => setPassword2(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            placeholder={t("Re-enter password")}
          />
        </div>

        {/* Error/success messages */}
        {error && <div className="text-red-600 mb-2 w-full text-center">{error}</div>}
        {success && <div className="text-green-600 mb-2 w-full text-center">{success}</div>}

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-6 w-full">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-black font-semibold"
            disabled={loading}
          >
            {t("Cancel")}
          </button>
          <button
            onClick={handleSignup}
            className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold"
            disabled={loading}
          >
            {loading ? t("Signing Up...") : t("Finish")}
          </button>
        </div>
      </div>
    </div>
  );
}
