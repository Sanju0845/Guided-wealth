export default async function handler(req, res) {
  try {
    const mainModule = await import('../index.js');
    const app = mainModule.default;
    return app(req, res);
  } catch (err) {
    console.error("Vercel Startup Error:", err);
    res.status(500).json({ error: "Startup Failed", message: err.message, stack: err.stack });
  }
}
