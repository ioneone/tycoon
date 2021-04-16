import { Socket } from "socket.io";
import { RoomJson } from "../common/Room";
import { TycoonOptions, TycoonUtil } from "../common/Tycoon";
import Lobby from "./Lobby";
import Tycoon from "./Tycoon";

class Room {
  public static readonly ID_LENGTH = 5;
  private static readonly CAPACITY = 2;

  private id: string;
  private host: Socket;
  private guests: { [id: string]: Socket };

  private tycoon: Tycoon;
  private tycoonOptions: TycoonOptions;

  constructor(id: string) {
    this.id = id;
    this.guests = {};
    this.tycoon = null;
    this.tycoonOptions = TycoonUtil.createDefaultTycoonOptions();
  }

  public addSocket(socket: Socket) {
    if (this.isFull()) return;

    // first socket is host
    if (this.host == null) {
      this.host = socket;
    } else {
      this.guests[socket.id] = socket;
    }

    socket.on("leave-room", () => {
      this.removeSocket(socket);
      Lobby.shared.addSocket(socket);

      if (socket.id === this.host.id) {
        Object.values(this.guests).forEach((guest) => {
          this.removeSocket(guest);
          Lobby.shared.addSocket(guest);
        });
        Lobby.shared.removeRoom(this.id);
      } else {
        this.broadcastRoomStatusUpdate();
      }
    });

    socket.on("disconnect", () => {
      this.removeSocket(socket);

      if (socket.id === this.host.id) {
        Object.values(this.guests).forEach((guest) => {
          this.removeSocket(guest);
          Lobby.shared.addSocket(guest);
          guest.emit("host-left");
        });
        Lobby.shared.removeRoom(this.id);
      } else {
        this.host.emit("guest-left", this.id);
        this.broadcastRoomStatusUpdate();
      }

      if (this.tycoon) {
        this.tycoon.removeEventListeners();
        this.tycoon = null;
      }
    });

    socket.on("start", () => {
      if (!this.isFull()) return;
      this.getSockets().forEach((socket) => {
        socket.emit("start-success", this.tycoonOptions);
      });

      this.tycoon = new Tycoon(this.host, Object.values(this.guests)[0]);
    });

    socket.on("options-update", (tycoonOptions: TycoonOptions) => {
      this.tycoonOptions = tycoonOptions;
      Object.values(this.guests).forEach((guest) =>
        guest.emit("room-status-update", this.toJson())
      );
    });

    this.broadcastRoomStatusUpdate();
  }

  public removeSocket(socket: Socket) {
    socket.removeAllListeners("leave-room");
    socket.removeAllListeners("start");
    socket.removeAllListeners("options-update");
    if (socket.id !== this.host.id) {
      delete this.guests[socket.id];
    }
  }

  public isFull() {
    return this.getSockets().length >= Room.CAPACITY;
  }

  public toJson(): RoomJson {
    return {
      id: this.id,
      numPlayers: this.getSockets().length,
      capacity: Room.CAPACITY,
      options: this.tycoonOptions,
    };
  }

  private getSockets() {
    return [this.host, ...Object.values(this.guests)];
  }

  private broadcastRoomStatusUpdate() {
    this.getSockets().forEach((socket) => {
      socket.emit("room-status-update", this.toJson());
    });
  }
}

export default Room;
