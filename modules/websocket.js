// ---------------------------------------------------------
// MODULE : WebSocket Deriv transaction
// ---------------------------------------------------------

export const DerivWS_for_transaction = {
    ws: null,
    connected: false,

    connect() {
        return new Promise((resolve, reject) => {

            // IMPORTANT : utilisez VOTRE WS_URL
            const WS_URL = "wss://ws.deriv.com/websockets/v3?app_id=32528";

            this.ws = new WebSocket(WS_URL);

            this.ws.onopen = () => {
                console.log("✔ WebSocket Deriv connecté");
                this.connected = true;
                resolve();
            };

            this.ws.onerror = (err) => {
                console.error("❌ Erreur WebSocket :", err);
                reject(err);
            };

            this.ws.onclose = () => {
                console.log("⚠ WebSocket fermé");
                this.connected = false;
            };
        });
    },

    send(data) {
        return new Promise((resolve, reject) => {
            if (!this.connected) {
                return reject("WebSocket non connecté");
            }

            this.ws.send(JSON.stringify(data));

            this.ws.onmessage = (msg) => {
                const response = JSON.parse(msg.data);
                resolve(response);
            };
        });
    }
};
