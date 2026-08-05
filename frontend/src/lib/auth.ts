import { EnvConfig } from "@/constants";

async function signUp(login: string, password: string) {
    const response = await fetch(`${EnvConfig.API_BASE}/auth/signup`, {
        method: "POST",
        body: JSON.stringify({
            login: login,
            password: password
        })
    })
}

async function login(login: string, password: string) {
    const response = await fetch(`${EnvConfig.API_BASE}/auth/login`, {
        method: "POST",
        body: JSON.stringify({
            login: login,
            password: password
        })
    })
}

export {signUp,login}