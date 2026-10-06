import Subscriber from "../models/Subscriber.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// @desc    Subscribe an email to the newsletter (opt-in)
// @route   POST /api/newsletter/subscribe
// @access  Public
export const subscribe = async (req, res) => {
  const { email, consent, source } = req.body;

  if (!email || !EMAIL_RE.test(String(email).trim())) {
    return res.status(400).json({ message: "A valid email is required" });
  }
  if (!consent) {
    return res.status(400).json({ message: "Consent is required to subscribe" });
  }

  try {
    const normalized = String(email).toLowerCase().trim();
    let subscriber = await Subscriber.findOne({ email: normalized });

    if (subscriber) {
      // Re-confirm / reactivate an existing (possibly unsubscribed) address
      subscriber.consent = true;
      subscriber.active = true;
      await subscriber.save();
      return res.status(200).json({ message: "You're subscribed — thanks for confirming!" });
    }

    subscriber = await Subscriber.create({
      email: normalized,
      consent: true,
      source: source || "footer",
    });

    res.status(201).json({
      message: "Subscribed! You'll get our market & SEBI updates.",
      id: subscriber._id,
    });
  } catch (error) {
    console.error("Newsletter subscribe error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Dispatch the newsletter to all active, opted-in subscribers via Brevo (free tier).
//          Triggered by Vercel Cron (sends Authorization: Bearer <CRON_SECRET>) or manually
//          with ?secret=<CRON_SECRET> for testing.
// @route   GET|POST /api/newsletter/send
// @access  Private (cron secret)
export const sendNewsletter = async (req, res) => {
  const authHeader = req.headers.authorization || "";
  const bearer = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  const secret = req.query.secret || bearer || req.headers["x-cron-secret"];

  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ message: "BREVO_API_KEY is not configured" });
  }

  const subject = req.body?.subject || "Guided Wealthy — Weekly Market & SEBI Update";
  const html =
    req.body?.html ||
    "<p>Your weekly market and SEBI update from Guided Wealthy. " +
    "Investments in financial markets are subject to market risks.</p>";

  try {
    // Cap per run to stay inside the free tier and serverless timeout.
    const subscribers = await Subscriber.find({ active: true, consent: true })
      .select("email")
      .limit(90);

    const sender = {
      name: "Guided Wealthy",
      email: process.env.BREVO_SENDER_EMAIL || "guidedwealthy@gmail.com",
    };

    let sent = 0;
    let failed = 0;

    for (const s of subscribers) {
      try {
        const r = await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            "api-key": apiKey,
            "content-type": "application/json",
            accept: "application/json",
          },
          body: JSON.stringify({ sender, to: [{ email: s.email }], subject, html }),
        });
        if (r.ok) {
          sent += 1;
        } else {
          failed += 1;
          console.error("Brevo send failed for", s.email, await r.text());
        }
      } catch (e) {
        failed += 1;
        console.error("Brevo send error", e.message);
      }
    }

    res.json({ message: "Newsletter dispatch finished", total: subscribers.length, sent, failed });
  } catch (error) {
    console.error("Send newsletter error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
