import logoImg from "../assets/images/logo.png";
import { useTranslation } from "react-i18next";

export default function Donate() {
  const {t} = useTranslation();
  return (
    <div className="min-h-screen bg-[#FBF2DA]">
      <h1 className="text-[6vw] font-bold text-[#a94442] mt-16 mb-8 text-center tracking-tight" style={{ fontFamily: 'serif' }}>Support us</h1>

      <div className="px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">{t("GIVING")}</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                {t("Donate-purpose")}
              </p>
              <p className="text-gray-600 leading-relaxed">
                {t("Donate-impact")}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 border cursor-pointer">
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={logoImg}
                  alt="Cultural Program Donation"
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {t("SUPPORT OUR CULTURAL PROGRAMS")}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {t("Chinese Heritage Foundation")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{t("DONATION")}</h2>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <button className="border-2 border-red-700 bg-red-700 hover:bg-red-800 text-yellow-100 font-semibold py-3 px-4 rounded-lg cursor-pointer">
                $25
              </button>
              <button className="border-2 border-red-700 text-gray-700 hover:bg-red-800 py-3 px-4 rounded-lg font-semibold cursor-pointer">
                $100
              </button>
              <button className="border-2 border-red-700 text-gray-700 hover:bg-red-800 py-3 px-4 rounded-lg font-semibold cursor-pointer">
                $2,500
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("Custom Amount")}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500">$</span>
                <input
                  type="number"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder={t("Enter amount")}
                />
              </div>
            </div>

            <div className="mb-6">
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="frequency"
                    className="mr-2"
                    defaultChecked
                  />
                  <span>{t("One Time")}</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="frequency" className="mr-2" />
                  <span>{t("Monthly")}</span>
                </label>
              </div>
            </div>

            <button className="w-full bg-red-700 hover:bg-red-800 text-yellow-100 font-semibold py-4 px-6 rounded-lg transition duration-200 cursor-pointer">
              {t("DONATE NOW")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}




