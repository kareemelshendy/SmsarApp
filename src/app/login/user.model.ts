export class User {
  constructor(
    public name: string,
    public role: string,
    private __token: string
  ) {}

  public get token() {
    return this.__token;
  }
}
