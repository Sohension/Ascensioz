import jwt from "jsonwebtoken"

const SECRET = process.env.GAME_TOKEN_SECRET!;

export function createGameToken(userId: string) {
  return jwt.sign(
    {
      user_id: userId,
    },
    SECRET,
    {
      expiresIn: "2h",
    },
  );
}

export function verifyGameToken(token: string) {
  return jwt.verify(token, SECRET) as {
    user_id: string;
  };
}
