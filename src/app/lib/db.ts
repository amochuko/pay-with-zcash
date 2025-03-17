import postgres from "postgres";

const sql =
  process.env.NODE_ENV != "production"
    ? postgres({
        host: process.env.PGHOST_LOCAL,
        user: process.env.PGUSER_LOCAL,
        database: process.env.PGDATABASE_LOCAL,
        password: process.env.PGPASSWORD_LOCAL,
        port: Number(process.env.PGPORT_LOCAL),
        ssl: false,
      })
    : postgres({
        host: process.env.PGHOST,
        user: process.env.PGUSER,
        database: process.env.PGDATABASE,
        password: process.env.PGPASSWORD,
        port: Number(process.env.PGPORT),
        ssl: true,
      });

export default sql;
