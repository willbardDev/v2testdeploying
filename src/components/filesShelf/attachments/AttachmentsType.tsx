export interface Attachment {
  id: number;
  name: string;
  path: string;
  full_path: string;
  type: string;
  attachmentable_id: number;
  attachmentable_type: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by: number;
}