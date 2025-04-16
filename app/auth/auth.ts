import { decode, encode } from "@gz/jwt";

type Payload = {
  aud: string;
  iat: number;
};

type PayloadBuilder = {
  aud: string;
  iat?: number;
};

const token = async (payload: PayloadBuilder, secret: string) => {
  if (payload.iat === undefined) {
    payload.iat = Date.now();
  }
  return await encode(payload, secret, { algorithm: "HS256" });
};

const decoded = async (token: string, secret: string) => {
  return await decode<Payload>(token, secret, { algorithm: "HS256" });
};

async function verify(token: string, secret: string, aud: string) {
  try {
    const payload = await decoded(token, secret);
    if (payload.aud !== aud) {
      throw new Error("Invalid audience");
    }
    if (Date.now() - payload.iat < 604800000) {
      throw new Error("Token expired");
    }
    return payload;
  } catch (e) {
    throw new Error("Invalid token");
  }
}

export { token, verify, decoded };
export type { Payload, PayloadBuilder };
