-- Allow admin panel (no-login) to manage team data publicly.
-- WARNING: User explicitly requested no authentication on /admin.
-- Anyone discovering the /admin URL can edit data. Add auth later for protection.

CREATE POLICY "Public manage team_members insert" ON public.team_members FOR INSERT WITH CHECK (true);
CREATE POLICY "Public manage team_members update" ON public.team_members FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public manage team_members delete" ON public.team_members FOR DELETE USING (true);

CREATE POLICY "Public manage team_faqs insert" ON public.team_faqs FOR INSERT WITH CHECK (true);
CREATE POLICY "Public manage team_faqs update" ON public.team_faqs FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public manage team_faqs delete" ON public.team_faqs FOR DELETE USING (true);

CREATE POLICY "Public manage team_reviews insert" ON public.team_reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Public manage team_reviews update" ON public.team_reviews FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public manage team_reviews delete" ON public.team_reviews FOR DELETE USING (true);

CREATE POLICY "Public manage agency_reviews insert" ON public.agency_reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Public manage agency_reviews update" ON public.agency_reviews FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public manage agency_reviews delete" ON public.agency_reviews FOR DELETE USING (true);

CREATE POLICY "Public manage agency_faqs insert" ON public.agency_faqs FOR INSERT WITH CHECK (true);
CREATE POLICY "Public manage agency_faqs update" ON public.agency_faqs FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Public manage agency_faqs delete" ON public.agency_faqs FOR DELETE USING (true);