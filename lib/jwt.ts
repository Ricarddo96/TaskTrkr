import jwt, { SignOptions } from "jsonwebtoken";

interface TokenPayload {
    userId: string;
    email: string;
    iat?: number; // Issued at (añadido automáticamente por JWT)
    exp?: number; // Expiration (añadido automáticamente por JWT)
  }

export function generateToken(userId: string, email: string): string {
  const payload = {
    userId: userId,
    email: email,
  };
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET no esta definido en las variables de entorno");
  }
  const options: SignOptions = {
    expiresIn: "7d",
  };
  return jwt.sign(payload, secret, options);
}

export function verifyToken(token: string): TokenPayload | null {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET no está definido en las variables de entorno");
  }
  try {
    const decoded = jwt.verify(token, secret) as TokenPayload;
    return decoded;
  } catch (error)
  {
    console.error("error al decodificar el token", error);
    return null;
  }
}
