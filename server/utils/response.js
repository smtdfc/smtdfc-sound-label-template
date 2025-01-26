module.exports = {
  responseSuccess(req, res, data = {}, auth = {}, code = 200) {
    if (auth.tokens && !req.headers.authorization) {
      const { accessToken, refreshToken } = auth.tokens;

      if (accessToken) {
        res.setCookie("at", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 15 * 60 * 1000,
          sameSite: "Lax",
          path: "/"
        });
      }

      if (refreshToken) {
        res.setCookie("rt", refreshToken, {
          httpOnly: true,
          secure: true,
          maxAge: 7 * 24 * 60 * 60 * 1000,
          sameSite: "Lax",
          path: "/"
        });
      }

      return res.code(code).send({
        status: "success",
        results: data,
        error: null,
        auth: null,
      });
    }

    return res.code(code).send({
      status: "success",
      results: data,
      error: null,
      auth,
    });
  },

  responseError(req, res, err = {}, code = 400) {
    return res.code(code).send({
      status: "error",
      error: err,
      result: null,
    });
  },
};