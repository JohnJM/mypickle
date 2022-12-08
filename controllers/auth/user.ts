import { createAuthToken, getUserData, hash } from "./helpers";
import { Request, Response } from "express";
import { prisma } from "../../server";

const register = async (
  { body: { username, password } = {} }: Request,
  res: Response
) => {
  try {
    const userExists = await prisma.user.findFirst({
      where: {
        username: {
          contains: username,
        },
      },
    });
    if (userExists)
      return res.status(400).json({ error: "Username already exists" });
    const user = await prisma.user.create({
      data: {
        username,
        password: await hash(password),
      },
    });
    const [token, maxAge] = createAuthToken(user);
    res.cookie("Authorization", token, { httpOnly: true, maxAge });
    res.status(200).json({ success: true });
  } catch {
    res.status(400).end();
  }
};

const login = async (
  { body: { username, password } = {} }: Request,
  res: Response
) => {
  try {
    const {
      user: { username: name },
      token: [token, maxAge],
    } = await getUserData({ username, password });
    res.status(200).cookie("Authorization", token, { maxAge }).json({
      name,
      token,
    });
  } catch {
    return res.status(400).json({ error: "Login failed" });
  }
};

export { register, login };
