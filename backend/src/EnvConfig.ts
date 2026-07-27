function processEnv(name: string) {
  const data = process.env[name];
  if (data === undefined) throw Error(`${name} is missing from the env file`);
  return data;
}
function processNumEnv(name: string) {
  const data = processEnv(name);
  return parseInt(data);
}

export const EnvConfig = {
  dbUsername: processEnv('DB_USERNAME'),
  dbHost: processEnv('DB_HOST'),
  dbPort: processNumEnv('DB_PORT'),
  dbPassword: processEnv('DB_PASSWORD'),
  dbName: processEnv('DB_NAME'),
};
