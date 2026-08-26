const EnvConfig = {
  API_BASE: process.env.NEXT_PUBLIC_API_BASE,
};
const AccessRejectedCode = 401;
const BadRequestCode = 400;
const NotFoundCode = 404;
const ServiceUnavailableCode = 503;
export {
  AccessRejectedCode,
  BadRequestCode,
  NotFoundCode,
  ServiceUnavailableCode,
  EnvConfig,
};
