import { BookType } from "@/types/BookTypes"
import st from "./bookCont.module.scss"
import { FC } from "react"
import { Book } from "../book/book"

interface BookContProps{
    books:BookType[]
}
export const BookCont:FC<BookContProps>=({books})=>{
    return(
        <div className={st.BookCont}>
        {books.map((book) => (
          <Book {...book} key={book.olid} />
        ))}
      </div>
    )
}