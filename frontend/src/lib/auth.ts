import { EnvConfig } from "@/constants";
import { cookies } from "next/headers";

const AccessTokenCookie = "libraryApiAccessToken";
const RefreshTokenCookie = "libraryApiRefreshToken";
const AccessTokenMaxAge = 15 * 60;
const RefreshTokenMaxAge = 7 * 24 * 60 * 60;

async function authenticate(path: "login" | "signup", login_: string, password: string) {
    const response = await fetch(`${EnvConfig.API_BASE}/auth/${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: login_, password }),
    });

    if (!response.ok) {
        throw new Error(await response.text());
    }

    const { accessToken, refreshToken } = await response.json();

    const cookieStore = await cookies();
    const isSecure = process.env.NODE_ENV === "production";
    cookieStore.set(AccessTokenCookie, accessToken, {
        maxAge: AccessTokenMaxAge,
        httpOnly: true,
        sameSite: "lax",
        secure: isSecure,
        path: "/",
    });
    cookieStore.set(RefreshTokenCookie, refreshToken, {
        maxAge: RefreshTokenMaxAge,
        httpOnly: true,
        sameSite: "lax",
        secure: isSecure,
        path: "/",
    });
}

async function signUp(login: string, password: string) {
    await authenticate("signup", login, password);
}

async function login(login: string, password: string) {
    await authenticate("login", login, password);
}

export { signUp, login };