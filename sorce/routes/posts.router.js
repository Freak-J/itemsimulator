import express from "express";
import { prisma } from "../utils/prisma/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// 캐릭터 생성 API
router.post("/posts", authMiddleware, async (req, res, next) => {
  const { name } = req.body;
  const { accountId } = req.account;

  const isExistcharacter = await prisma.character.findFirst({
    where: {
      name,
    },
  });

  if (isExistcharacter) {
    return res.status(400).json({ message: "이미 존재하는 이름입니다." });
  }

  const post = await prisma.character.create({
    data: {
      accountId: +accountId,
      name: name,
    },
  });

  return res
    .status(201)
    .json({ message: `이름 : ${post.name} 캐릭터번호 : ${post.characterId}` });
});

// 캐릭터 삭제 API
router.delete("/posts/:characterId", authMiddleware, async (req, res, next) => {
  const { characterId } = req.params;

  await prisma.character.delete({
    where: { characterId: +characterId },
  });

  return res
    .status(200)
    .json({ message: `${characterId}번 캐릭터가 삭제되었습니다.` });
});

// 캐릭터 상세 조회 API
router.get("/posts/:characterId", async (req, res, next) => {
  const { characterId } = req.params;
  const { authorization } = req.cookies;
  let post = {};
  let accountId = 0;

  // 현재 캐릭터 번호를 가지고 있는 계정번호
  const result = await prisma.character.findFirst({
    where: { characterId: +characterId },
    select: {
      accountId: true,
    },
  });

  // 현재 로그인 중인 계정번호
  if (authorization !== undefined) {
    const [tokenType, token] = authorization.split(" ");
    const decodedToken = jwt.verify(token, "custom-secret-key");
    accountId = decodedToken.accountId;
  }

  // 로그인중인 계정번호 === 현재 검색하고 있는 캐릭터를 가지고 있는 계정번호
  if (result.accountId === accountId) {
    post = await prisma.character.findFirst({
      where: { characterId: +characterId },
      select: {
        name: true,
        health: true,
        power: true,
        money: true,
      },
    });
  } else {
    post = await prisma.character.findFirst({
      where: { characterId: +characterId },
      select: {
        name: true,
        health: true,
        power: true,
      },
    });
  }
  return res.status(200).send(post);
});

export default router;
