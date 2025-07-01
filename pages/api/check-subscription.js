export default function handler(req, res) {
  // Check if user has premium access
  // For now, return demo mode
  res.status(200).json({ premium: false, trial: true });
}
