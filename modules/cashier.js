// ---------------------------------------------------------
// MODULE : Cashier Deriv
// ---------------------------------------------------------
import { DerivWS_for_transaction } from "./websocket.js";

// ---------------------------------------------------------
// 1. Envoyer email pour recevoir code Cashier
// ---------------------------------------------------------
export function requestEmail(email) {
    return DerivWS_for_transaction.send({
        verify_email: email,
        type: "account_opening"   // IMPORTANT : DOIT ÊTRE CELUI-CI
    });
}

// ---------------------------------------------------------
// 2. Générer le lien Cashier
// ---------------------------------------------------------
export function generateLink(code) {
    return DerivWS_for_transaction.send({
        cashier: "deposit",  // ou "withdrawal" si besoin
        verification_code: code
    });
}
