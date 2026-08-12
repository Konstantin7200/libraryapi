export const bookListOptions=['Want to read' , 'Currently reading' , 'Already read','All'] as const
export type bookListItemType=typeof bookListOptions[number]