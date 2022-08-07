import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { db, cache } from "./utils/persistence";
import bodyParser from "body-parser";
import fetch from "node-fetch";

dotenv.config();

type ProductResponseFromDS = {
  name: string;
  price: number;
  id: number;
};

const app: Express = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Health check
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

// Create user
app.post(
  "/auth",
  async (
    req: Request<{}, {}, { email: string; fullName: string }>,
    res: Response<{ id: number }>,
    next: NextFunction
  ) => {
    try {
      const body = req.body;
      const { email, fullName } = body;
      if (!email || !fullName) {
        throw new Error("Email and fullName are required fields.");
      }

      const doesEmailExist = await db.user.findFirst({
        where: {
          email,
        },
      });

      if (doesEmailExist) {
        throw new Error("This email address is already in use.");
      }
      const createUser = await db.user.create({
        data: {
          email,
          fullName,
        },
      });

      if (createUser) {
        await cache.set(String(createUser.id), JSON.stringify(createUser));
        return res.send({ id: createUser.id });
      }
      throw new Error("Failed to create user, please try again.");
    } catch (error) {
      next(error);
    }
  }
);

// Create notification
app.post(
  "/notification",
  async (
    req: Request<
      {},
      {},
      {
        productId: number;
        price: number;
        threshold: "ABOVE" | "BELOW";
        userId: number;
      }
    >,
    res: Response<{ message: string }>,
    next: NextFunction
  ) => {
    try {
      const body = req.body;
      const { threshold, productId, price, userId } = body;

      if (!threshold || !productId || !price || !userId) {
        throw new Error(
          "threshold, productId, price and userId are all required parameters."
        );
      }

      const doesUserExist = await db.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!doesUserExist) {
        throw new Error("This user doesn't exist.");
      }
      const doesProductExist = await db.product.findFirst({
        where: {
          id: productId,
        },
      });

      if (!doesProductExist) {
        throw new Error("This product doesn't exist.");
      }

      await cache.set(String(doesUserExist.id), JSON.stringify(doesUserExist));

      const createNotification = await db.userNotification.create({
        data: {
          price,
          type: threshold,
          user: {
            connect: {
              id: userId,
            },
          },
          products: {
            connect: {
              id: productId,
            },
          },
        },
      });

      if (!createNotification) {
        throw new Error(
          "Cannot create notification at this time. Please try again."
        );
      }

      const alertCacheKey = `${doesProductExist.name}:${
        threshold === "ABOVE" ? 1 : -1
      }`;
      const subscribedUsersCacheKey = `${doesProductExist.name}:${
        threshold === "ABOVE" ? 1 : -1
      }:${price}`;
      await cache.zAdd(alertCacheKey, [{ value: String(price), score: price }]);
      await cache.sAdd(subscribedUsersCacheKey, JSON.stringify(doesUserExist));
      return res.status(200).send({
        message: "Notification successfully created.",
      });
    } catch (error) {
      next(error);
    }
  }
);

// Get user notification
app.get(
  "/notification/:userId",
  async (
    req: Request<{ userId: number }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.params.userId;

      if (!userId) {
        throw new Error("userId must be provided as a request parameter.");
      }

      const doesUserExist = await db.user.findFirst({
        where: {
          id: Number(userId),
        },
        select: {
          notifications: {},
        },
      });

      if (!doesUserExist) {
        throw new Error("This user doesn't exist");
      }

      return res.send(doesUserExist.notifications);
    } catch (error) {
      next(error);
    }
  }
);

// Get all products by data source
app.get(
  "/ds/products",
  async (
    req: Request<{ userId: number }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const products = await db.product.findMany();

      return res.send(products);
    } catch (error) {
      next(error);
    }
  }
);

// Get all products by users
app.get(
  "/products",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //   TODO: change to url of the data source.
      const request = await fetch(
        `http://ss:${process.env.SS_PORT}/ds/products/`
      );

      if (request.status !== 200) {
        throw new Error("Unable to retrieve products now. Please try again.");
      }

      const response = (await request.json()) as ProductResponseFromDS[];

      for (const prod of response) {
        await db.product.update({
          where: {
            id: prod.id,
          },
          data: {
            price: prod.price,
          },
        });
      }

      res.send(response);
    } catch (error) {
      next(error);
    }
  }
);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.json({
    errors: {
      message: err.message,
    },
  });
});

export default app;
