-- Enable RLS on designs table
ALTER TABLE designs ENABLE ROW LEVEL SECURITY;

-- Policy for selecting designs
CREATE POLICY "Users can view their own designs"
ON designs FOR SELECT
USING (auth.uid() = user_id);

-- Policy for inserting designs
CREATE POLICY "Users can insert their own designs"
ON designs FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy for updating designs
CREATE POLICY "Users can update their own designs"
ON designs FOR UPDATE
USING (auth.uid() = user_id);

-- Policy for deleting designs
CREATE POLICY "Users can delete their own designs"
ON designs FOR DELETE
USING (auth.uid() = user_id);

-- Grant access to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON designs TO authenticated;
