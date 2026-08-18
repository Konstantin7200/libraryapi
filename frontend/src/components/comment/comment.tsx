'use client';

import { FC } from "react";
import { BaseComment } from "../baseComment/baseComment";
import { CommentType } from "@/types/CommentType";

export const Comment: FC<CommentType> = (comment) => {

  return (
    <BaseComment {...comment} linkText={null}/>
  );
};