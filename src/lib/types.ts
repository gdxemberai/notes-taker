export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  folder: NoteFolder;
  createdAt: string;
  updatedAt: string;
}

export type NoteFolder = "personal" | "work" | "ideas" | "archive";

export interface AIResult {
  kind: "summary" | "improve" | "title" | "tags" | "expand";
  content: string;
  meta?: { tokens?: number; model?: string };
}
