CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price NUMERIC(10, 2) NOT NULL
);

INSERT INTO products (name, price) VALUES
  ('Wireless Mouse', 19.99),
  ('Mechanical Keyboard', 59.99),
  ('USB-C Hub', 24.50)
ON CONFLICT DO NOTHING;
