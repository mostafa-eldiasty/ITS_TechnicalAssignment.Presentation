export class Response<T> {
  results!: T;
  status: number = 0;
  messages: string[] = [];
}
