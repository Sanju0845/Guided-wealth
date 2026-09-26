let app;
try {
    const mainModule = await import('../index.js');
    app = mainModule.default;
} catch (err) {
    console.error("Vercel Startup Error:", err);
    // Fallback app to display the error
    const express = (await import('express')).default;
    app = express();
    app.all('*', (req, res) => {
        res.status(500).json({ 
            error: "Startup Failed", 
            message: err.message, 
            stack: err.stack 
        });
    });
}
export default app;
