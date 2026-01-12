SELECT schemaname, tablename, policyname, cmd, roles
FROM pg_policies 
WHERE tablename = 'posts';
