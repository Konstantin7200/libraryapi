'use client';
import { Favorite } from "@mui/icons-material"
import st from "./like.module.scss"
import { FC } from "react"
import { toggleLike } from "@/lib/likes"

interface LikeProps{
    liked:boolean,
    olid:string,
    position?:'relative'
}
export const Like:FC<LikeProps> = ({liked,olid,position}) => {
    const iconStyle = { width: "80px", height: "80px", color: liked ? 'red' : 'rgb(122, 123, 124)' }
    const handleLikeClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        toggleLike(olid);
    };
    return (
        <div className={position==='relative'?st.RelativeIconWrapper:st.IconWrapper} onClick={handleLikeClick}>
            <Favorite sx={iconStyle} />
        </div>
    )
}