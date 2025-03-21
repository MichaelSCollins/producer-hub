DROP TABLE IF EXISTS audio_files;
-- Create the table if it doesn't exist
CREATE TABLE IF NOT EXISTS audio_files (
    id long PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    content_type VARCHAR(255) NOT NULL,
    size BIGINT NOT NULL,
    duration DOUBLE PRECISION,
    uploaded_at TIMESTAMP NOT NULL,
    storage_type VARCHAR(50) NOT NULL,
    storage_location VARCHAR(255) NOT NULL
);

-- First, drop the primary key constraint if it exists
ALTER TABLE audio_files DROP CONSTRAINT IF EXISTS audio_files_pkey;

-- Create a temporary UUID column
ALTER TABLE audio_files ADD COLUMN temp_id long;

-- Update the temporary column with UUID values from existing IDs where possible
UPDATE audio_files 
SET temp_id = CASE
    WHEN id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' 
    THEN id::long
END;

-- Drop the old id column and rename temp_id to id
ALTER TABLE audio_files DROP COLUMN id;
ALTER TABLE audio_files RENAME COLUMN temp_id TO id;

-- Add NOT NULL constraint and primary key
ALTER TABLE audio_files ALTER COLUMN id SET NOT NULL;
ALTER TABLE audio_files ADD PRIMARY KEY (id); 