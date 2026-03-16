-- CREATE TABLES

-- Surveys Table
CREATE TABLE IF NOT EXISTS public.surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Questions Table
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID REFERENCES public.surveys(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('text', 'choice', 'rating', 'multi-choice')),
  options JSONB, -- Array of strings for choices
  "order" INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Responses Table
CREATE TABLE IF NOT EXISTS public.responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID REFERENCES public.surveys(id) ON DELETE CASCADE,
  answers_jsonb JSONB NOT NULL, -- Flexible structure to store question_id -> answer mapping
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- INSERT DEMO DATA
INSERT INTO public.surveys (id, title, description)
VALUES 
  ('11111111-1111-1111-1111-111111111111', '環保意識問卷調查', '感謝您撥空填寫這一份問卷，本問卷目的是在探討您的環保知多少。')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.questions (survey_id, question_text, type, options, "order")
VALUES 
  ('11111111-1111-1111-1111-111111111111', '1.您的年級：', 'choice', '["8~12", "13~18", "18~30"]'::jsonb, 1),
  ('11111111-1111-1111-1111-111111111111', '2.您平時是否有隨手做資源回收的習慣？', 'choice', '["總是", "經常", "偶爾", "從不"]'::jsonb, 2),
  ('11111111-1111-1111-1111-111111111111', '3.手搖飲喝完會如何分類？', 'choice', '["會洗杯子但不拔封膜", "不洗杯子不拔封膜", "會洗杯子會拔封膜", "直接丟一般垃圾"]'::jsonb, 3),
  ('11111111-1111-1111-1111-111111111111', '7. 根據環境部數據，台灣每年垃圾量持續攀升（113 年已達約 1176 萬公斤），得知這項資訊後是否會增加您想做好回收的意願？', 'choice', '["會，非常有感", "會，稍微增加", "不會"]'::jsonb, 4),
  ('11111111-1111-1111-1111-111111111111', '4. 在遊戲中進行「垃圾回收分類」的操作是否容易理解？', 'choice', '["非常容易", "容易", "普通", "有點困難"]'::jsonb, 5),
  ('11111111-1111-1111-1111-111111111111', '5. 您覺得這款遊戲的內容會太簡單嗎？（針對內容深度進行評估 ）', 'choice', '["太簡單", "剛剛好", "有點難", "太難"]'::jsonb, 6),
  ('11111111-1111-1111-1111-111111111111', '9. 您覺得這款遊戲最吸引您的地方是什麼？（複選）', 'multi-choice', '["遊戲主題（環保）", "打鬥環節（打怪/Boss）", "回收挑戰", "畫面設計"]'::jsonb, 7),
  ('11111111-1111-1111-1111-111111111111', '6. 玩完遊戲後，您是否更清楚哪些垃圾是可以回收的？', 'choice', '["是，非常清楚", "是，有增加了解", "沒什麼差別"]'::jsonb, 8),
  ('11111111-1111-1111-1111-111111111111', '8. 您是否認同「透過遊戲學習環保知識」比單純聽課更有效？', 'choice', '["非常認同", "認同", "不認同", "非常不認同"]'::jsonb, 9),
  ('11111111-1111-1111-1111-111111111111', '10. 對於這款遊戲，您有什麼其他的改進建議？', 'text', NULL, 10);
