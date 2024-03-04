import jwt from 'jsonwebtoken';

export const initialJwtVerify = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next();
  }

  if (token) {
    try {
      const payload = jwt.verify(token, process.env.TOKEN_SECRET);
      req.user = payload;

      next();
    } catch (err) {
      return res
        .status(200)
        .json({ success: false, auth: false, message: 'Authentication error' });
    }
  }
};

export const jsonwebtokenVerify = (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res
      .status(200)
      .json({ success: false, auth: false, message: 'Authentication error' });
  }

  if (token) {
    try {
      const payload = jwt.verify(token, process.env.TOKEN_SECRET);
      req.user = payload;

      next();
    } catch (err) {
      res.status(401).json({
        success: false,
        auth: false,
        role: false,
        message: 'Your session has expired, please log in again',
      });
    }
  }
};
