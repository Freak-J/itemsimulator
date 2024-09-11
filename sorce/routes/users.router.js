import express from "express";
import { prisma } from "../utils/prisma/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authMiddleware from "../middlewares/auth.middleware.js";
import { Prisma } from "@prisma/client";

const router = express.Router();

// 회원가입 API
router.post("/sign-up", async (req, res, next) => {
  try {
    const { id, password, passwordCheck, name } = req.body;
    const isExistAccount = await prisma.account.findFirst({
      where: {
        id,
      },
    });

    if (isExistAccount) {
      return res.status(400).json({ message: "이미 존재하는 아이디입니다." });
    }
    function isValidId(id) {
      // 영어 소문자와 숫자만 허용
      const regex = /^[a-z0-9]+$/;
      return regex.test(id);
    }

    if (!isValidId(id)) {
      return res.status(400).json({ message: "잘못된 아이디입니다." });
    }
    if (!password === passwordCheck) {
      return res
        .status(400)
        .json({ message: "비밀번호와 비밀번호 확인이 다릅니다." });
    }

    if (password.length < 5) {
      return res
        .status(400)
        .json({ message: "비밀번호가 6자 이상이 아닙니다." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [account] = await prisma.$transaction(async (tx) => {
      const account = await tx.account.create({
        data: {
          id,
          password: hashedPassword,
          passwordCheck: hashedPassword,
          name,
        },
      });

      return [account];
    });

    return res
      .status(201)
      .json({ message: `아이디 : ${account.id} 이름 : ${account.name}` });
  } catch (err) {
    next(err);
  }
});

// 로그인 API
router.post("/sign-in", async (req, res, next) => {
  const { id, password } = req.body;

  const user = await prisma.account.findFirst({ where: { id } });

  if (!user) {
    return res.status(404).json({ message: "존재하지 않는 아이디입니다." });
  }
  if (!(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });
  }

  // 엑세스 토큰 발급
  const token = jwt.sign({ accountId: user.accountId }, "custom-secret-key");
  res.cookie("authorization", `Bearer ${token}`);

  return res.status(200).json({ message: "로그인에 성공하였습니다." });
});


export default router;
