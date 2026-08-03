import os
from datetime import datetime

import psycopg2


def run_report():
    conn = psycopg2.connect(
        host=os.environ["DB_HOST"],
        port=os.environ.get("DB_PORT", 5432),
        user=os.environ["DB_USER"],
        password=os.environ["DB_PASSWORD"],
        dbname=os.environ["DB_NAME"],
    )
    cur = conn.cursor()
    cur.execute("SELECT COUNT(*), SUM(price) FROM products")
    count, total = cur.fetchone()
    print(f"[{datetime.now()}] Products: {count}, Total value: {total}")
    cur.close()
    conn.close()


if __name__ == "__main__":
    run_report()
