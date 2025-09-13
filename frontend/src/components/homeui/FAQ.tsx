import { PlusIcon, MinusIcon } from "@heroicons/react/16/solid"
import { useState } from "react"
import { useTranslation } from "react-i18next";

type QuestionProps = {
    question:string;
    answer:string;
}

function Question({question, answer}: QuestionProps) {
    const [display, setDisplay] = useState(false);
    return (
        <div>
            <div className="flex justify-between items-center mb-10 mt-5 text-3xl">
                <div>
                    {question}
                </div>
                <button className="flex justify-center items-center" onClick={() => setDisplay(!display)}>
                    {(!display)? <PlusIcon className="h-6"/>: <MinusIcon className="h-6"/>}
                </button>
            </div>
            <div className="text-[1.25rem] mb-5">
                {(display)? answer : ""}
            </div>
        </div>
    )
}
export default function FAQ() {
    const { t } = useTranslation();
    return (
        <div className="flex bg-[#d6d2cb] px-20 py-40">
            <div className="font-mystery w-1/2 text-7xl">
                {t("FAQs")}
            </div>
            <div className="w-1/2">
                <hr />
                    <Question question={t("Question1")} answer="Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio tempore nesciunt sed, incidunt eos asperiores."/>
                <hr />
                    <Question question={t("Question1")} answer="Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio tempore nesciunt sed, incidunt eos asperiores."/>
                <hr />
                    <Question question={t("Question1")} answer="Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio tempore nesciunt sed, incidunt eos asperiores."/>
                <hr />
                    <Question question={t("Question1")} answer="Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio tempore nesciunt sed, incidunt eos asperiores."/>
                <hr />
            </div>
        </div>
    )
}