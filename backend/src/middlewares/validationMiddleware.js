export function validate(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params
    });

    if (!result.success) {
      return next({
        status: 400,
        message: result.error.issues.map((issue) => issue.message).join(", ")
      });
    }

    req.validated = result.data;
    next();
  };
}
