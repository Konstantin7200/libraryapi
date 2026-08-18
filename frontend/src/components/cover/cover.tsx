import Image from 'next/image';
import { MenuBook } from '@mui/icons-material';
import { FC } from 'react';
import st from './cover.module.scss';

interface coverProps {
  coversUrl: string | null;
  title: string;
  className?: string;
}
export const Cover: FC<coverProps> = ({ coversUrl, title, className }) => {
  return (
    <>
      {coversUrl ? (
        <Image
          src={coversUrl}
          width={'300'}
          height={'450'}
          alt={title + ' cover image'}
          className={className}
        />
      ) : (
        <EmptyCover title={title} className={className} />
      )}
    </>
  );
};
interface EmptyCoverProps {
  title: string;
  className?: string;
}
const EmptyCover: FC<EmptyCoverProps> = ({ title, className }) => {
  return (
    <div className={[st.EmptyCover, className].filter(Boolean).join(' ')}>
      <MenuBook className={st.icon} />
      <p className={st.text}>
        No cover was found for<br></br>
        {title}
      </p>
    </div>
  );
};
