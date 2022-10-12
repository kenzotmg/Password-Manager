CREATE TABLE IF NOT EXISTS passwords (
   primary_key INTEGER PRIMARY KEY,
   source text NOT NULL,
   username text NULL,
   password text NOT NULL
);
