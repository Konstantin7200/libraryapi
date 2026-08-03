import { BookType } from "@/types/BookTypes"
import st from "./page.module.scss"
import { Book } from "@/components/book/book"
import { EnvConfig } from "@/constants"

export default async function page() {
  const response=await fetch(`${EnvConfig.API_BASE}/books?title=&author=tolkien`)
  const data=await response.json() as BookType[]
  return (
    <div className={st.page}>
      <h1>Books</h1>
      <div className={st.BookCont}>{data.map((book)=><Book {...book} key={book.olid}/>)}</div>
    </div>
  )
}
