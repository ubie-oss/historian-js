export interface ICommand {
  execute(): void;

  cancel(): void;
}

export class Command implements ICommand {
  constructor(private name: string) {}

  public cancel(): void {}

  public execute(): void {}
}
