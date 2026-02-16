export interface Page {
  id: string;
  title: string;
  content: string; // Markdown content
  pageNumber: number;
}

export enum AppMode {
  READING = 'READING',
  EDITING = 'EDITING'
}

export type BookColor = 'brown' | 'red' | 'blue' | 'green' | 'black';

export interface BookData {
  id: string; // Unique ID for library management
  title: string;
  subtitle?: string;
  author: string;
  coverColor: BookColor;
  createdAt: number;
  pages: Page[];
}