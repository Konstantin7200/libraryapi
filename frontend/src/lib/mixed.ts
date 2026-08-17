'use server';

import { bookListItemType } from "@/types/BookListTypes";
import { BookType } from "@/types/BookTypes";
import { Paginated } from "@/types/Paginated";
import { apiFetch } from "./apiWrapper";


export async function getMixedBooks(bookList:bookListItemType,liked?:boolean,query?:string,page=1): Promise<Paginated<BookType>>{
    const params=new URLSearchParams({type:bookList,page:String(page)});
    if(liked!==undefined) params.append('liked',String(liked));
    if(query!==undefined) params.append('query',query);
    const response=await apiFetch(`/mixed-list?${params.toString()}`)
    const data:Paginated<BookType>=await response.json()
    return data;
}