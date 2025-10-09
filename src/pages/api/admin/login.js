// Admin credentials from environment variables
const ADMIN_LOGIN = process.env.ADMIN_LOGIN || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "landscape2024";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(400).json({ 
      success: false, 
      message: "Логін та пароль обов'язкові" 
    });
  }

  if (login === ADMIN_LOGIN && password === ADMIN_PASSWORD) {
    return res.status(200).json({ 
      success: true, 
      message: "Успішний вхід" 
    });
  } else {
    return res.status(401).json({ 
      success: false, 
      message: "Невірний логін або пароль" 
    });
  }
}
