import { BookCont } from "@/components/bookCont/bookCont"
import st from "./page.module.scss"

const Page=()=>{
    return(
        <div className={st.page}>
            <h1>Likes</h1>
            <BookCont books={[]}/>
        </div>
    )
}
export default Page