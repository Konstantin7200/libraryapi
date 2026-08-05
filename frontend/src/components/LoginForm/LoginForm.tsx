'use client';

import { FC, useState } from "react";
import st from "./LoginForm.module.scss"
import { Button, FormControl, TextField } from "@mui/material";

interface LoginFormProps{
    handleClick:(login:string,password:string)=>void,
    variant:"signUp"|"login"
}
export const LoginForm:FC<LoginFormProps>=({handleClick,variant})=>{
    const [login,setLogin]=useState("")
    const [password,setPassword]=useState("")
    const buttonText=variant==="login"?"Login":"Sign up"
    return (
        <div className={st.LoginForm}>
            <FormControl>
                <TextField label="Username" value={login} onChange={(e)=>setLogin(e.target.value)}/>
                <TextField label="Password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                <Button variant="contained" onClick={()=>handleClick(login,password)}>{buttonText}</Button>
            </FormControl>
        </div>
    )
}