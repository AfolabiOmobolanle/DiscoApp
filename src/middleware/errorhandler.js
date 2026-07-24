const { 
  STATUS_BAD_REQUEST,
  STATUS_NOT_FOUND,
  STATUS_CONFLICT,
  STATUS_INTERNAL_SERVER_ERROR,
  STATUS_SERVICE_UNAVAILABLE,
} = require('../utils/statuscodes');

function errorHandler(err, req, res, next) {
  console.error(`[Error] ${req.method} ${req.url} —`, err.message);

  // Knex / Postgres — duplicate entry
  if (err.code === '23505') {
    return res.status(STATUS_CONFLICT).json({
      success:    false,
      statusCode: STATUS_CONFLICT,
      error:      'Duplicate entry — record already exists',
    });
  }

  // Knex / Postgres — FK violation
  if (err.code === '23503') {
    return res.status(STATUS_BAD_REQUEST).json({
      success:    false,
      statusCode: STATUS_BAD_REQUEST,
      error:      'Referenced record does not exist',
    });
  }

  // Axios / external API errors (SecurePay, BuyPower etc.)
  if (err.isAxiosError) {
    return res.status(STATUS_SERVICE_UNAVAILABLE).json({
      success:    false,
      statusCode: STATUS_SERVICE_UNAVAILABLE,
      error:      'External API error',
      message:    err.response?.data?.message || err.message,
    });
  }

  // Not found
  if (err.status === STATUS_NOT_FOUND || err.message === 'Not found') {
    return res.status(STATUS_NOT_FOUND).json({
      success:    false,
      statusCode: STATUS_NOT_FOUND,
      error:      err.message || 'Resource not found',
    });
  }

  // Default — 500
  const status = err.status || STATUS_INTERNAL_SERVER_ERROR;
  res.status(status).json({
    success:    false,
    statusCode: status,
    error:      err.message || 'Internal server error',
  });
}

module.exports = errorHandler;