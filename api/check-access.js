export default function handler(req, res) {
  const { userId, examId } = req.body;

  res.status(200).json({ hasAccess: false });
}
