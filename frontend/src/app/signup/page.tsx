import { LoginForm } from "@/components/LoginForm/LoginForm"
import st from "./page.module.scss"
import { signUp } from "@/lib/auth"
import Link from "next/link"
import { redirect } from "next/navigation"

const Page=()=>{
    const signUpFunc=async(login:string,password:string)=>{
        'use server';
        await signUp(login,password);
        redirect("/books");
    }
    return(
        <div className={st.page}>
            <div className={st.hero}>
                <h1 className={st.title}>Create your account</h1>
                <p className={st.description}>Join our library community to save your favorite books, build lists, and never lose your place.</p>
            </div>
            <div className={st.card}>
                <LoginForm variant="signUp" handleClick={signUpFunc}/>
            </div>
            <p className={st.footer}>
                Already have an account? <Link href="/login">Sign in</Link>
            </p>
        </div>
    )
}
export default Page