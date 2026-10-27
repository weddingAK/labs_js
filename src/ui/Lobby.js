export class Lobby extends EventTarget {
  constructor(containerElement) {
    super();
    this.container = containerElement;
    this.rooms = [];
    this.selectedRoom = null;
    this.playerName = "Pilot";
    this.timerId = null;
    this.abortController = null;
  }

  render() {
    this.container.innerHTML = `
      <div id="lobby-screen" style="position: absolute; inset: 0; background: #111; display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 10;">
        <h2>Game Lobby</h2>
        <div style="margin-bottom: 15px;">
          <label>Player Name: <input type="text" id="player-name" value="${this.playerName}" /></label>
        </div>
        <div style="margin-bottom: 15px; width: 300px;">
          <h3>Rooms:</h3>
          <ul id="rooms-list" style="list-style: none; padding: 0; max-height: 150px; overflow-y: auto; background: #222; border: 1px solid #444;">
            <li style="padding: 8px; color: #888;">Loading rooms...</li>
          </ul>
        </div>
        <button id="join-btn" disabled style="padding: 10px 20px; font-size: 16px; cursor: pointer;">Join Game</button>
      </div>
    `;

    this.container
      .querySelector("#player-name")
      .addEventListener("input", (e) => {
        this.playerName = e.target.value;
      });

    this.container.querySelector("#join-btn").addEventListener("click", () => {
      if (this.selectedRoom) {
        this.destroy();
        this.dispatchEvent(
          new CustomEvent("start-game", {
            detail: { playerName: this.playerName, room: this.selectedRoom },
          }),
        );
      }
    });

    this.startPolling();
  }

  async fetchRooms() {
    this.abortController = new AbortController();
    try {
      // Використовуємо AbortSignal.timeout (або звичайний сигнал)
      const response = await fetch("/api/rooms", {
        signal: AbortSignal.timeout(3000),
      });
      if (!response.ok) throw new Error("Failed to fetch rooms");
      this.rooms = await response.json();
    } catch (err) {
      // Fallback якщо бекенду немає (для локального запуску Vite)
      this.rooms = [
        { id: "room-1", name: "Alpha Arena (Default)", players: 1 },
        { id: "room-2", name: "Beta Sector", players: 0 },
      ];
    }
    this.updateRoomsUI();
  }

  updateRoomsUI() {
    const listEl = this.container.querySelector("#rooms-list");
    if (!listEl) return;

    listEl.innerHTML = "";
    this.rooms.forEach((room) => {
      const li = document.createElement("li0"); // або просто li
      const liElem = document.createElement("li");
      liElem.style.padding = "8px";
      liElem.style.cursor = "pointer";
      liElem.style.borderBottom = "1px solid #333";
      liElem.textContent = `${room.name} (${room.players} players)`;

      if (this.selectedRoom?.id === room.id) {
        liElem.style.background = "#005555";
      }

      liElem.addEventListener("click", () => {
        this.selectedRoom = room;
        this.updateRoomsUI();
        this.container.querySelector("#join-btn").removeAttribute("disabled");
      });
      listEl.appendChild(liElem);
    });
  }

  startPolling() {
    this.fetchRooms();
    this.timerId = setInterval(() => this.fetchRooms(), 5000);
  }

  destroy() {
    if (this.timerId) clearInterval(this.timerId);
    if (this.abortController) this.abortController.abort();
    const screen = this.container.querySelector("#lobby-screen");
    if (screen) screen.remove();
  }
}
