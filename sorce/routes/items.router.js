import express from "express";
import { prisma } from "../utils/prisma/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/items", async (req, res, next) => {
  const { name, status, price } = req.body;

  const isExistitem = await prisma.item.findFirst({
    where: {
      name,
    },
  });

  if (isExistitem) {
    return res.status(400).json({ message: "이미 존재하는 이름입니다." });
  }

  const item = await prisma.item.create({
    data: {
      name: name,
      status: status,
      price: price,
    },
  });

  return res.status(201).send(item);
});

router.patch("/items/:itemId", async (req, res, next) => {
  const { name, status } = req.body;
  const { itemId } = req.params;

  const item = {
    name,
    status,
  };

  await prisma.$transaction(async (tx) => {
    await tx.item.update({
      data: {
        name: name,
        status: status,
      },
      where: {
        itemId: +itemId,
      },
    });
    return res.status(200).send(item);
  });
});

router.get("/items", async (req, res, next) => {
  const item = await prisma.item.findMany({
    select: {
      itemId: true,
      name: true,
      price: true,
    },
    orderBy: {
      itemId: "asc",
    },
  });
  return res.status(200).send(item);
});

router.get("/items/:itemId", async (req, res, next) => {
  const { itemId } = req.params;

  const item = await prisma.item.findFirst({
    where: { itemId: +itemId },
    select: {
      itemId: true,
      name: true,
      status: true,
      price: true,
    },
  });
  return res.status(200).send(item);
});

export default router;
