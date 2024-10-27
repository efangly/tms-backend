import express,{ Application, NextFunction, Response, Request } from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import { globalErrorHanlder } from "./middlewares";
import { prisma } from "./configs";
import { ZTempLog } from "./models";
import { tempLogs } from "@prisma/client";
import swaggerUi from 'swagger-ui-express';
import fs from 'node:fs';
import YAML from 'yaml';

const app: Application = express();
dotenv.config();
const port: number = parseInt(process.env.PORT as string, 10) || 8080;
const file = fs.readFileSync("./swagger.yaml", "utf8");
app.use((req: Request, res: Response, next: NextFunction) => {
  express.json()(req, res, (err) => {
    if (err) {
      console.error('Invalid JSON', err);
      return res.status(400).json({ 
        message: 'Invalid JSON',
        success: false,
        data: null,
      });
    }
    next();
  });
});
app.use(cors({ origin: '*' }));
app.use(morgan("dev"));
app.use('/tms/api-docs', swaggerUi.serve, swaggerUi.setup(YAML.parse(file)));
app.get('/tms/templog', async (_req, res, next) => {
  try {
    const result = await prisma.tempLogs.findMany();
    res.json({ 
      message: 'Successful',
      success: true,
      data: result 
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});
app.post('/tms/templog', async (req, res, next) => {
  try {
    const data = ZTempLog.parse(req.body);
    const result = await prisma.tempLogs.create({
      data: data as tempLogs
    });
    res.status(201).json({ 
      message: 'Successful',
      success: true,
      data: result 
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
  
});
app.use(globalErrorHanlder);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});