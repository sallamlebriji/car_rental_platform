export function notFound(_req, res) {
  res.status(404).json({ message: "Route introuvable" });
}

export function errorHandler(error, _req, res, _next) {
  const status = error.status || 500;
  res.status(status).json({
    message: error.message || "Erreur serveur"
  });
}
