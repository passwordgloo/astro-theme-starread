export interface Article {  slug: string;  data: {    title: string;    categories?: string[];    [key: string]: any;  };}

export interface TagCount {  [tag: string]: number;}

export interface TagPageProps {  tagName?: string;  allTags?: TagCount;  currentTag?: string;  articles?: Article[];  title?: string;}