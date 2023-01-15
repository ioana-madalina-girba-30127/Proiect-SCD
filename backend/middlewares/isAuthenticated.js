import jwt from "jsonwebtoken";

export const isAuthenticated = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json("Un-Authorizedddd");
  }

  try {
    const [bearer, token] = authorization.split(" ");
    if (!bearer || !token) {
      return res.status(401).json(err);
    }

    const secret = "super_secret";
    const payload = jwt.verify(token, secret);
    req.payload = payload;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json(err);
    }
    return res.status(401).json(err);
  }
};
