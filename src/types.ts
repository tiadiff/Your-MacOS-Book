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

export interface BookData {
  title: string;
  author: string;
  pages: Page[];
}