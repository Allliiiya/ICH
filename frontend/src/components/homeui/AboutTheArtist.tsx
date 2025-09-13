import Ahri from "../../assets/images/workshop_5.jpg";
import { useTranslation } from "react-i18next";

function Artist() {
  return (
    <div className="bg-gray-200 p-4">
      <img className="w-32" src={Ahri} alt="ahri" />
      <div className="pb-1">Ahri</div>
      <div className="text-[0.75rem] italic pb-1">Lorem, ipsum.</div>
      <div className="text-[0.75rem] italic">Lorem ipsum dolor.</div>
      <div className="text-[0.75rem] italic">Lorem ipsum dolor.</div>
    </div>
  );
}
export default function ArtistGallery() {
  const { t } = useTranslation();
  return (
    <div className="bg-white flex">
      <div className="px-20 py-10 w-1/2">
        <div className="font-mystery text-7xl pb-10">{t("About Us")}</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Artist />
          <Artist />
          <Artist />
          <Artist />
          <Artist />
          <Artist />
          <Artist />
          <Artist />
        </div>
      </div>
      <img className="w-1/2" src={Ahri} alt="decoration-img" />
    </div>
  );
}

