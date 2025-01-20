export interface Submission {
  id: number;
  artistAddress: string;
  name: string;
  topic: string;
  preview: string;
  averageTotal: number;
  averageCount: number;
  averageValue: bigint;
}
