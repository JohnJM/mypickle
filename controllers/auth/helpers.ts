import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { prisma } from "../../server";

const hash = async (pwd: string) => bcrypt.hash(pwd, await bcrypt.genSalt());

const createAuthToken = (
  { id, role }: User,
  maxAge = 1 * 24 * 60 * 60
): [string, number] => [
  sign({ id, role }, process.env["JWT_SECRET"] as string, {
    expiresIn: maxAge,
  }),
  maxAge,
];

const getUserData = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      username: {
        equals: username,
      },
    },
    take: 1,
  });
  if (!(await compare(password, user.password)))
    throw new Error("Invalid password!");
  return { user, token: createAuthToken(user) };
};

export { getUserData, createAuthToken, hash };
