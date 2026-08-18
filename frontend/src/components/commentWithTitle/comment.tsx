'use client';

import { FC } from "react";
import { BaseComment } from "../baseComment/baseComment";
import { CommentTypeWithTitle } from "@/types/CommentType";

export const CommentWithTitle: FC<CommentTypeWithTitle> = (comment) => {

  return (
    <BaseComment {...comment} linkText={comment.bookTitle}/>
  );
};