"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Question, SurveyCard } from "@/components/SurveyCard";
import { ProgressBar } from "@/components/ProgressBar";
import { Loader2 } from "lucide-react";

const FALLBACK_QUESTIONS: Question[] = [
  { id: "1", question_text: "How would you rate your experience?", type: "rating", options: null },
  { id: "2", question_text: "Which feature do you use the most?", type: "choice", options: ["Analytics", "Dashboard", "Reporting", "Settings"] },
  { id: "3", question_text: "Any additional feedback?", type: "text", options: null },
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
      try {
        const { data: surveyData } = await supabase.from("surveys").select("id").limit(1).single();
        if (surveyData) {
          setSurveyId(surveyData.id);
          const { data: qData, error } = await supabase
            .from("questions")
            .select("*")
            .eq("survey_id", surveyData.id)
            .order("order", { ascending: true });
            
          if (error) throw error;
          if (qData && qData.length > 0) {
            setQuestions(qData);
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        console.log("Using fallback questions manually (DB down or missing keys).");
      }
      setQuestions(FALLBACK_QUESTIONS);
      setLoading(false);
    }
    loadQuestions();
  }, []);

  const handleAnswer = (val: any) => {
    setAnswers(prev => ({ ...prev, [questions[currentStep].id]: val }));
  };

  const handleNext = async () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
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
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
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
