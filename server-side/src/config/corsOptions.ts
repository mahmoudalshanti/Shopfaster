const allowedOrigins: string[] = ["http://localhost:5173"];

const corsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error(`Access denied from origin: ${origin}`));
    }
  },
  optionsSuccessStatus: 200,
  credentials: true,
};

export default corsOptions;
