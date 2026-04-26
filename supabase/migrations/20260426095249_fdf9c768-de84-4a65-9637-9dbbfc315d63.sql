-- Allow public uploads, updates and deletes to the team-photos bucket
-- (admin panel currently has no auth gating; align with existing public team_members policies)

CREATE POLICY "Public upload team photos"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'team-photos');

CREATE POLICY "Public update team photos"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'team-photos')
WITH CHECK (bucket_id = 'team-photos');

CREATE POLICY "Public delete team photos"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'team-photos');