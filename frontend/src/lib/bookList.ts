'use server';

import { bookListItemType } from "@/types/BookListTypes";
import { apiFetch } from "./apiWrapper";
import { BookType } from "@/types/BookTypes";

export async function addToBookList(olid:string,bookList:bookListItemType){
    const response=await apiFetch("/book-list",{method:"POST",body:{status:bookList,bookOlid:olid}})
}

export async function getBookList(bookList:bookListItemType){
    const searchString=bookList?`?type=${bookList}`:``;
    const response=await apiFetch(`/book-list${searchString}`)
    const data:BookType[]=await response.json()
    return data;
}