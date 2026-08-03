-- Example migration, kept separate from init.sql so you can practice
-- running it as a one-off K8s Job (kubectl apply -f a Job manifest)
-- instead of baking it into container startup.

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price NUMERIC(10, 2) NOT NULL
);
