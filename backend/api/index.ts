import { createApp } from '../dist/app';
import { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
  const app = await createApp();
  const expressInstance = app.getHttpAdapter().getInstance() as (
    request: Request,
    response: Response,
  ) => void | Promise<void>;
  expressInstance(req, res);
}
