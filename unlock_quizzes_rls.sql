-- Allow anyone to insert/update quizzes and questions (since admin panel uses anon key)
create policy "Anyone can insert quizzes" on public.quizzes for insert with check (true);
create policy "Anyone can update quizzes" on public.quizzes for update using (true);
create policy "Anyone can delete quizzes" on public.quizzes for delete using (true);

create policy "Anyone can insert questions" on public.questions for insert with check (true);
create policy "Anyone can update questions" on public.questions for update using (true);
create policy "Anyone can delete questions" on public.questions for delete using (true);
