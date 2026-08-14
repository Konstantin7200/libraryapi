'use server';

import { bookListItemType } from "@/types/BookListTypes";
import { BookType } from "@/types/BookTypes";
import { apiFetch } from "./apiWrapper";


export async function getMixedBooks(bookList:bookListItemType,liked?:boolean,query?:string){
    const params=new URLSearchParams({type:bookList});
    if(liked!==undefined) params.append('liked',String(liked));
    if(query!==undefined) params.append('query',query);
    const response=await apiFetch(`/mixed-list?${params.toString()}`)
    const data:BookType[]=await response.json()
    return data;
}