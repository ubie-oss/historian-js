import { CommandHistory } from "./CommandHistory";
import { Command } from "./Command";

describe("Command History", () => {
  describe("new", () => {
    test("ポインターの初期値は-1、コマンドは空", () => {
      const history = new CommandHistory();

      expect(history.pointer).toBe(-1);
      expect(history.commands).toEqual([]);
    });
  });

  describe("add", () => {
    test("1つ目のコマンドを追加するとポインターは0、2つ目のコマンドを追加するとポインターは1になる", () => {
      const upCommand = new Command("up");
      const history = new CommandHistory();

      history.add(upCommand);

      expect(history.pointer).toBe(0);

      history.add(upCommand);

      expect(history.pointer).toBe(1);
    });

    test("コマンドを追加したら、現在のポインター位置の直後にコマンドが追加され、それより後のコマンドは削除される", () => {
      const upCommand = new Command("up");
      const downCommand = new Command("down");
      const leftCommand = new Command("left");
      const history = new CommandHistory();

      history.add(upCommand);
      history.add(downCommand);
      expect(history.pointer).toBe(1);
      expect(history.commands).toEqual([upCommand, downCommand]);

      // ポインターを戻す
      history.undo();
      expect(history.pointer).toBe(0);
      expect(history.commands).toEqual([upCommand, downCommand]);

      history.add(leftCommand);

      expect(history.pointer).toBe(1);
      expect(history.commands).toEqual([upCommand, leftCommand]);
    });
  });

  describe("undo", () => {
    test("直前のコマンドを巻き戻せる", () => {
      const history = new CommandHistory();
      const command = new Command("new command");

      jest.spyOn(command, "cancel");

      history.add(command);

      history.undo();

      expect(command.cancel).toHaveBeenCalled();
    });

    test("連続でコマンドを巻き戻せる", () => {
      const history = new CommandHistory();
      const oldCommand = new Command("old command");
      const newCommand = new Command("new command");

      jest.spyOn(oldCommand, "cancel");

      history.add(oldCommand);
      history.add(newCommand);

      history.undo();
      expect(oldCommand.cancel).not.toHaveBeenCalled();

      history.undo();
      expect(oldCommand.cancel).toHaveBeenCalled();
    });

    test("undoすると、ポインター位置のコマンドがcancelされ、ポインターの値が1下がる", () => {
      const upCommand = new Command("up");
      const downCommand = new Command("down");
      const history = new CommandHistory();

      jest.spyOn(downCommand, "cancel");

      history.add(upCommand);
      history.add(downCommand);

      expect(history.pointer).toBe(1);

      history.undo();

      expect(history.pointer).toBe(0);
      expect(history.commands).toEqual([upCommand, downCommand]);
      expect(downCommand.cancel).toHaveBeenCalled();
    });

    test("undo し続けても、ポインターは-1より減らない", () => {
      const upCommand = new Command("up");
      const history = new CommandHistory();

      history.add(upCommand);
      expect(history.pointer).toBe(0);

      history.undo();
      expect(history.pointer).toBe(-1);

      history.undo();
      expect(history.pointer).toBe(-1);
    });

    test("履歴が空のときに undo しても、エラーにならない", () => {
      const history = new CommandHistory();
      expect(() => history.undo).not.toThrowError();
    });
  });

  describe("redo", () => {
    test("redoを呼ぶと、ポインター位置の次の位置のコマンドが実行される", () => {
      const upCommand = new Command("up");
      const history = new CommandHistory();

      jest.spyOn(upCommand, "execute");

      history.add(upCommand);

      expect(history.pointer).toBe(0);
      history.undo();
      expect(history.pointer).toBe(-1);
      history.redo();

      expect(history.pointer).toBe(0);
      expect(history.commands).toEqual([upCommand]);
      expect(upCommand.execute).toHaveBeenCalled();
    });

    test("履歴が空のときに redo しても、エラーにならない", () => {
      const history = new CommandHistory();
      expect(() => history.redo).not.toThrowError();
    });
  });

  describe("clear", () => {
    test("履歴をクリアできる", () => {
      const command = new Command("up");
      const history = new CommandHistory();

      history.add(command);
      expect(history.commands).toHaveLength(1);

      history.clear();
      expect(history.commands).toHaveLength(0);
      expect(history.pointer).toBe(-1);
    });
  });
});
