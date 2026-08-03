import { BookType } from "@/types/BookTypes"
import st from "./page.module.scss"
import { Book } from "@/components/book/book"
import { EnvConfig } from "@/constants"
import { SearchParams } from "next/dist/server/request/search-params"
import { FC } from "react"

interface pageProps{
  searchParams:Promise<SearchParams>
}
const page:FC<pageProps>=async({searchParams})=> {
  const {title,author,page}=await searchParams
  const response=await fetch(`${EnvConfig.API_BASE}/books?${title?`title=${title}&`:""}${author?`author=${author}&`:""}${page?`page=${page}`:""}`)
  const data=await response.json() as BookType[]
  return (
    <div className={st.page}>
      <h1>Books</h1>
      <div className={st.BookCont}>{data.map((book)=><Book {...book} key={book.olid}/>)}</div>
    </div>
  )
}
export default page