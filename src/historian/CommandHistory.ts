import { ICommand } from "./Command";

export interface ICommandHistory {
  add(command: ICommand): void;
  undo(): void;
  redo(): void;
  clear(): void;
}

/**
 * コマンド履歴を管理する
 * コマンドパターンで実装している
 */
export class CommandHistory implements ICommandHistory {
  public commands: ICommand[] = [];

  // 現在のコマンド
  // -1は、指しているコマンドがないことを表す。
  public pointer: number = -1;

  /**
   * コマンドを記録する
   *
   * undo後addすると、元のポインターより後のコマンドはクリアされる
   * ブラウザでバック後、ページを進んだ場合、元の履歴はクリアされるブラウザの挙動に合わせている
   */
  public add(command: ICommand): void {
    if (this.commands.length === 0) {
      this.commands.push(command);
      this.pointer++;
      return;
    }

    this.commands = this.commands.slice(0, this.pointer + 1);
    this.commands.push(command);

    this.pointer++;
  }

  /**
   * コマンドをキャンセルする
   */
  public undo(): void {
    if (this.commands.length === 0) {
      return;
    }

    const command = this.commands[this.pointer];
    if (!command) {
      return;
    }

    this.pointer--;
    command.cancel();
  }

  /**
   * キャンセルしたコマンドをやり直す
   */
  public redo(): void {
    if (this.commands.length === 0) {
      return;
    }

    const command = this.commands[this.pointer + 1];
    if (!command) {
      return;
    }

    this.pointer++;
    command.execute();
  }

  public clear(): void {
    this.commands.length = 0;
    this.pointer = -1;
  }
}
