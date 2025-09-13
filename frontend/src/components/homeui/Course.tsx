import { useTranslation } from "react-i18next";
import { YouTubePlayer } from "../Video";
import { useState } from "react";

type ProgressProps = {
    completeness: number;
}
function Progress({completeness}: ProgressProps) {
    const clampedCompleteness = Math.max(0, Math.min(100, completeness));
        // <div className="mx-auto border bg-white h-10 w-300 rounded-2xl mt-5 border-0">{/*TODO*/}</div>
    return (
        <div className="mx-auto border-white border-2 h-10 w-full md:w-3/4 lg:w-3/4 rounded-2xl mt-5 overflow-hidden shadow-inner ">

            <div
                className="bg-green-700 h-full rounded-2xl transition-all duration-500 ease-out flex items-center pl-5"
                style={{ width: `${clampedCompleteness}%` }}
                role="progressbar"
                aria-valuenow={clampedCompleteness}
                aria-valuemin={0}
                aria-valuemax={100}
            >
                <span className="text-1xl text-white">{clampedCompleteness}% Complete</span>
            </div>
        </div>
    );
}

export default function Course() {
    const { t } = useTranslation();

    const n = 4;
    const dx = 100 * (1/n);
    const [completeness, setCompleteness] = useState<number>(0);
    const increaseCompleteness = () => {
        setCompleteness((prev) => prev + dx);
    }
    return (
        <div className="bg-[#d6d2cb] flex flex-col p-6">
            <h1 className="font-mystery mt-20 mx-auto text-7xl items-center p-4">{t("Heritage")}</h1>
            <div className="mx-auto text-2xl p-4 mt-5">{t("Learn more about the diverse Chinese Intangible Cultural Inheritage")}</div>
            <button className="bg-green-700 mx-auto text-xl items-center rounded-md text-white w-[200px] px-2 py-3 mt-5">{t("Start Course")}</button>

            <Progress completeness={completeness} />
            
            <div className="flex flex-col mt-10 bg-white p-6 w-200 mx-auto">
                <div>
                    <div className="text-3xl">
                        {t("Chapter1")}
                    </div>
                    <div className="text-[0.9rem]">
                        2 Lessions*0:22
                    </div>
                </div>
                
                <div className="my-5 flex gap-10">
                    { /* <img src={Ahri} alt="/" className="justify-start h-30"/>  */ }
                    <YouTubePlayer videoId="rio9-h1T8_Y" increaseCompleteness={increaseCompleteness}/>
                    <div>
                        <div>{t("Lession 1")}</div>
                        <div>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Commodi, repellat.</div>
                        <div>0:11</div>
                    </div>
                </div>
                
                <div className="my-5 flex gap-10">
                    <YouTubePlayer videoId="2xAmQ4y44eo" increaseCompleteness={increaseCompleteness}/>
                    <div>
                        <div>{t("Lession 1")}</div>
                        <div>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Commodi, repellat.</div>
                        <div>0:11</div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col mt-10 bg-white p-6 w-200 mx-auto">
                <div>
                    <div className="text-3xl">
                        {t("Chapter1")}
                    </div>
                    <div className="text-[0.9rem]">
                        2 Lessions*0:22
                    </div>
                </div>
                
                <div className="my-5 flex gap-10">
                    <YouTubePlayer videoId="t7Q-MkGfdHg" increaseCompleteness={increaseCompleteness}/>
                    <div>
                        <div>{t("Lession 1")}</div>
                        <div>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Commodi, repellat.</div>
                        <div>0:11</div>
                    </div>
                </div>
                
                <div className="my-5 flex gap-10">
                    <YouTubePlayer videoId="eoZEBwX6nJ4" increaseCompleteness={increaseCompleteness}/>
                    <div>
                        <div>{t("Lession 1")}</div>
                        <div>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Commodi, repellat.</div>
                        <div>0:11</div>
                    </div>
                </div>
            </div>
        </div>
    )
}