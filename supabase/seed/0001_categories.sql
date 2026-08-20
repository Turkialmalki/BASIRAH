-- Seed: top-level categories (spec §17 knowledge graph + §9 onboarding interests).
-- Course/chapter/scene seed content lands in Phase 4 (three showcase courses)
-- and Phase 2 seed (20 courses, metadata-only).

insert into categories (slug, title_ar, title_en, color_token) values
  ('money', 'المال والاستثمار', 'Money & Investing', 'categoryMoney'),
  ('psychology', 'النفس والسلوك', 'Psychology & Behavior', 'categoryPsychology'),
  ('leadership', 'القيادة', 'Leadership', 'categoryLeadership'),
  ('technology', 'التقنية والذكاء الاصطناعي', 'Technology & AI', 'categoryTech'),
  ('history', 'التاريخ', 'History', 'categoryHistory'),
  ('self_development', 'تطوير الذات', 'Self Development', 'categoryGrowth'),
  ('entrepreneurship', 'ريادة الأعمال', 'Entrepreneurship', 'categoryEntrepreneurship'),
  ('saudi', 'السعودية', 'Saudi Arabia', 'categorySaudi'),
  ('health', 'الصحة', 'Health', 'categoryGrowth'),
  ('philosophy', 'الفلسفة', 'Philosophy', 'categoryPsychology')
on conflict (slug) do nothing;
