type Languages = 'it'

export const errors: { [key: string]: { [key in Languages]: string } } = {
  server_error: {
    it: 'Errore server. Riprovare più tardi.',
  },
  invalid_server_response: {
    it: 'Risposta server non valida. Riprovare più tardi.',
  },
  login_wrong_credentials: {
    it: 'Credenziali di accesso errate.',
  },
  forbidden: {
    it: "Non si hanno i permessi per effettuare l'operazione.",
  },
  insufficient_role: {
    it: 'Non hai un ruolo sufficientemente elevato.',
  },
  login_wrong_otp_credentials: {
    it: 'Il codice è errato.',
  },
  linked_events_error: {
    it: 'Il tipo di evento è collegato a degli eventi esistenti.',
  },
}
