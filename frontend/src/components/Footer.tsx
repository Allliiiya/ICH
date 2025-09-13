import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import SignupPopup from "./SignupPopup";
export default function Footer() {
    const { t } = useTranslation();
    const [showSignupPopup, setShowSignupPopup] = useState(false);
    const [signupEmail, setSignupEmail] = useState("");
    const [signupError, setSignupError] = useState("");
    const validateEmail = (email: string) => {
        return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
    };
    const handleEmailSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSignupError("");
        if (!validateEmail(signupEmail)) {
            setSignupError(t("Please enter a valid email address."));
            return;
        }
        setShowSignupPopup(true);
    };
    const handleSignupClose = () => {
        setShowSignupPopup(false);
        setSignupEmail("");
    };

    return (
    <footer className="bg-[#FBF2DA] w-full min-h-[60vh] flex flex-col items-center justify-center rounded-b-3xl">
            <div className="flex flex-col items-center justify-center w-full">
                <h2 className="text-[56px] font-serif font-bold text-[#c14641] mb-6 text-center">Heritage</h2>
                <div className="mb-10 text-[22px] text-[#5c7a7a] text-center font-normal">Sign up with your email address to receive news and updates.</div>
                <form className="flex flex-row items-center justify-center mb-10" onSubmit={handleEmailSubmit}>
                    <input
                        type="email"
                        value={signupEmail}
                        onChange={e => setSignupEmail(e.target.value)}
                        placeholder={t("Email Address")}
                        className="w-[400px] h-[60px] px-8 py-4 text-[22px] rounded-l-lg border border-gray-200 focus:outline-none bg-white font-normal"
                    />
                    <button
                        type="submit"
                        className="bg-[#5c7a7a] hover:bg-[#466666] text-white px-12 h-[60px] text-[22px] rounded-r-full font-normal transition-colors"
                    >
                        {t("Sign Up")}
                    </button>
                </form>
                {signupError && <div className="text-red-600 mt-2 text-center">{signupError}</div>}
                <div className="flex flex-row justify-center gap-10 mt-10 text-[20px]">
                    <a href="#about" className="text-[#c14641] underline">About</a>
                    <a href="#contact" className="text-[#c14641] underline">Contact</a>
                    <a href="#follow" className="text-[#c14641] underline">Follow</a>
                </div>
            </div>
            {showSignupPopup && (
                <SignupPopup emailPrefill={signupEmail} onClose={handleSignupClose} />
            )}
        </footer>
    );
}