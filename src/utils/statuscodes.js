const apiHttpStatusCode = {
  STATUS_OK:                    200,
  STATUS_CREATED:               201,
  STATUS_ACCEPTED:              202,
  STATUS_PERMANENT_REDIRECT:    301,
  STATUS_BAD_REQUEST:           400,
  STATUS_UNAUTHORIZED:          401,
  STATUS_PAYMENT_REQUIRED:      402,
  STATUS_FORBIDDEN:             403,
  STATUS_NOT_FOUND:             404,
  STATUS_CONFLICT:              409,
  STATUS_GONE:                  410,
  STATUS_UNPROCESSABLE_ENTITY:  422,
  STATUS_INTERNAL_SERVER_ERROR: 500,
  STATUS_SERVICE_UNAVAILABLE:   503,
};

module.exports = apiHttpStatusCode;