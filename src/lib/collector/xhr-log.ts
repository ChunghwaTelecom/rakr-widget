export class XhrLog {
  created: number;
  duration: number;

  url: string;
  method: string;
  headers: { [name: string]: string; };
  status: number;
}
