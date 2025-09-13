import Ahri from "../assets/images/workshop_5.jpg";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";

export default function Game() {
  const { t } = useTranslation();
  return (
    <div>
      <div className="pb-40 pt-28 bg-[#d6d2cb]">
        <div className="text-green-700 text-7xl text-center mt-30">
          {t("Try this out!")}
        </div>
        <div className="mt-10 mb-20 text-center">
          {t("Description...tea whisking")}
        </div>
        <img className="w-[80%] mx-auto" src={Ahri} alt="ahri" />
        <div className="text-green-700 text-4xl text-center my-10">
          {t("Now try to make Whisking tea yourself!")}
        </div>
        <div className="flex px-10 py-20">
          <img src={Ahri} className="flex-1/2 w-0" alt="ahri" />
          <div className="flex-1/2 px-10 py-20">{t("Game instruction")}</div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
