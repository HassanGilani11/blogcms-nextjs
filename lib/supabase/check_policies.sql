SELECT schemaname, tablename, policyname, cmd, roles, cmd 
FROM pg_policies 
WHERE tablename = 'categories';
