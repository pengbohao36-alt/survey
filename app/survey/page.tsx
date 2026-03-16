"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Question, SurveyCard } from "@/components/SurveyCard";
import { ProgressBar } from "@/components/ProgressBar";
import { Loader2 } from "lucide-react";

const FALLBACK_QUESTIONS: Question[] = [
  { id: "1", question_text: "1.您的年級：", type: "choice", options: ["8~12", "13~18", "18~30"] },
  { id: "2", question_text: "2.您平時是否有隨手做資源回收的習慣？", type: "choice", options: ["總是", "經常", "偶爾", "從不"] },
  { id: "3", question_text: "3.手搖飲喝完會如何分類？", type: "choice", options: ["會洗杯子但不拔封膜", "不洗杯子不拔封膜", "會洗杯子會拔封膜", "直接丟一般垃圾"] },
  { id: "7", question_text: "7. 根據環境部數據，台灣每年垃圾量持續攀升（113 年已達約 1176 萬公斤），得知這項資訊後是否會增加您想做好回收的意願？", type: "choice", options: ["會，非常有感", "會，稍微增加", "不會"] },
  { id: "4", question_text: "4. 在遊戲中進行「垃圾回收分類」的操作是否容易理解？", type: "choice", options: ["非常容易", "容易", "普通", "有點困難"] },
  { id: "5", question_text: "5. 您覺得這款遊戲的內容會太簡單嗎？（針對內容深度進行評估 ）", type: "choice", options: ["太簡單", "剛剛好", "有點難", "太難"] },
  { id: "9", question_text: "9. 您覺得這款遊戲最吸引您的地方是什麼？（複選）", type: "multi-choice", options: ["遊戲主題（環保）", "打鬥環節（打怪/Boss）", "回收挑戰", "畫面設計"] },
  { id: "6", question_text: "6. 玩完遊戲後，您是否更清楚哪些垃圾是可以回收的？", type: "choice", options: ["是，非常清楚", "是，有增加了解", "沒什麼差別"] },
  { id: "8", question_text: "8. 您是否認同「透過遊戲學習環保知識」比單純聽課更有效？", type: "choice", options: ["非常認同", "認同", "不認同", "非常不認同"] },
  { id: "10", question_text: "10. 對於這款遊戲，您有什麼其他的改進建議？", type: "text", options: null },
];

export default function SurveyPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [surveyId, setSurveyId] = useState<string>("fallback");
  const [loading, setLoading] = useState(true);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadQuestions() {
      // Temporarily forcing fallback questions to ensure immediate update on Vercel
      // while the database content is being synced/updated.
      setQuestions(FALLBACK_QUESTIONS);
      setLoading(false);
      
      try {
        const { data: surveyData } = await supabase.from("surveys").select("id").limit(1).single();
        if (surveyData) {
          setSurveyId(surveyData.id);
        }
      } catch (e) {
        console.log("DB check failed or missing keys.");
      }
    }
    loadQuestions();
  }, []);

  const handleAnswer = (val: any) => {
    setAnswers((prev: Record<string, any>) => ({ ...prev, [questions[currentStep].id]: val }));
  };

  const handleNext = async () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep((prev: number) => prev + 1);
    } else {
      // Submit
      setSubmitting(true);
      try {
        if (surveyId !== "fallback") {
          await supabase.from("responses").insert({
            survey_id: surveyId,
            answers_jsonb: answers,
          });
        }
        router.push("/success");
      } catch (err) {
        console.error("Failed to submit", err);
        // Navigate anyway for demo UX
        router.push("/success");
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep((prev: number) => prev - 1);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-white animate-spin opacity-50" />
      </div>
    );
  }

  const currentQuestion = questions[currentStep];

  return (
    <div className="flex-1 flex flex-col p-6 max-w-4xl w-full mx-auto justify-center">
      <ProgressBar currentStep={currentStep} totalSteps={questions.length} />
      
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        {submitting ? (
          <Loader2 className="w-12 h-12 text-white animate-spin opacity-50" />
        ) : (
          <SurveyCard
            question={currentQuestion}
            answer={answers[currentQuestion.id]}
            onAnswerChange={handleAnswer}
            onNext={handleNext}
            onPrev={handlePrev}
            isFirst={currentStep === 0}
            isLast={currentStep === questions.length - 1}
          />
        )}
      </div>
    </div>
  );
}
