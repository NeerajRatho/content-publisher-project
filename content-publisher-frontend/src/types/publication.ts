export type PublicationStatus = "draft" | "published" | "archived";

export interface Publication {
  id: number;
  title: string;
  content: string;
  status: PublicationStatus;
  created_at?: string;
  updated_at?: string;
}
