export interface Repository {
  id: string;
  name: string;
  clone_url: string;
  size_in_bytes: number;
  status: "READY" | "FAILED" | "PENDING" | "INDEXING" | "INGESTING";
  last_indexed_at: string | null;
}