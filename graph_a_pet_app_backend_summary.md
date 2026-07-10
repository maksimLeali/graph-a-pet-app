# Graph-a-Pet — Sintesi aggiornata App + Backend

Data: 2026-07-09  
Stato: documento di sintesi funzionale/architetturale aggiornato assumendo operative le ultime estensioni su Shelter, notifiche, persone, inviti, workspace personali, ownership, claim e discovery.

---

## 1. Visione generale

**Graph-a-Pet** è una piattaforma mobile-first per la gestione di animali domestici, proprietari, custodie condivise, attività, trattamenti, segnalazioni e rifugi.

L'applicazione nasce come **PWA Ionic/React**, ma l'architettura è già compatibile con una futura evoluzione mobile tramite **Capacitor**. Il backend è un server **GraphQL schema-first** in Python, basato su Flask, Ariadne, SQLAlchemy e PostgreSQL.

La parte più evoluta del prodotto è il modulo **Shelter Management**, che trasforma l'app in uno strumento operativo per rifugi/canili/gattili: ruoli, pet ospitati, box, mappe, task, passeggiate, inventario, dashboard, notifiche e flussi di onboarding persone.

---

## 2. Frontend app

### 2.1 Stack principale

Il frontend è una PWA/mobile web app basata su:

- **Ionic Framework + React** per UI mobile-first;
- **TypeScript** per tipizzazione statica;
- **Vite** come bundler/dev server;
- **Apollo Client** per GraphQL;
- **GraphQL Code Generator** per generare tipi e hook;
- **Capacitor** come base per packaging mobile futuro;
- **i18next** per internazionalizzazione;
- **styled-components** e tema custom per design system;
- **Leaflet/react-leaflet** per funzionalità mappa.

L'app segue un pattern **feature-based**: ogni area funzionale ha router, pagine, componenti e operazioni GraphQL proprie.

### 2.2 Struttura funzionale

Le sezioni principali sono:

- **Auth**: login, registrazione, verifica utente;
- **Home**: dashboard utente;
- **Pets**: gestione animali, dettaglio, creazione, ownership/custodia;
- **Events**: calendario e dettagli evento;
- **Board**: segnalazioni/smarrimenti/ritrovamenti;
- **Settings**: profilo e impostazioni;
- **Shelters**: gestione rifugi, workspace personali, persone, ruoli, task, walk, inventory, mappe, dashboard;
- **Notifications**: inbox notifiche interna all'app.

### 2.3 Routing

Le rotte private sono protette da autenticazione. L'utente autenticato accede alle sezioni principali tramite router Ionic/React.

Le rotte shelter rilevanti sono:

```text
/shelters
/shelters/discover
/shelters/public/:id
/shelters/detail/:id
/shelters/detail/:id/people
/shelters/detail/:id/invites
/shelters/detail/:id/ownership
/shelters/detail/:id/verification
/shelters/detail/:id/tasks
/shelters/detail/:id/tasks/new
/shelters/detail/:id/walks
/shelters/detail/:id/inventory
/shelters/detail/:id/inventory/new
/shelters/detail/:id/map
/shelters/add-pet/:id
/notifications
```

### 2.4 Data layer

Il frontend comunica con il backend esclusivamente tramite **GraphQL**.

Apollo Client:

- invia il JWT come Bearer token;
- intercetta errori `401/403`;
- gestisce logout automatico in caso di sessione non valida;
- usa i tipi generati da GraphQL Codegen.

Le operazioni GraphQL sono co-locate dentro i moduli frontend, in particolare nel modulo `shelters`.

### 2.5 Context principali

- **AppContext**: stato globale UI minimo;
- **UserContext**: utente autenticato, dashboard, pets, reports, preferenze UI, refresh dati;
- **ModalContext**: gestione overlay/modali condivisi;
- **Notification integration**: conteggio notifiche non lette e accesso alla inbox.

### 2.6 Design e UX

L'app è progettata mobile-first:

- layout ottimizzato per viewport strette;
- interazioni touch;
- pagine dedicate invece di modali per flussi complessi;
- stile flat coerente con il tema;
- CTA essenziali e contestuali;
- permessi gestiti lato backend, ma azioni non autorizzate nascoste/disabilitate lato frontend.

---

## 3. Backend

### 3.1 Stack principale

Il backend è un server GraphQL in Python basato su:

- **Flask** come web framework;
- **Ariadne** per GraphQL schema-first;
- **PostgreSQL** come database;
- **SQLAlchemy** come ORM;
- **Alembic** per migrazioni;
- **APScheduler** per cron job;
- **Redis** opzionale per lock distribuito dei job;
- **JWT** per autenticazione;
- **Gunicorn/Docker** per deploy.

Endpoint principali:

```text
POST /graphql
GET  /graphql
REST media endpoints
REST translations endpoints
```

### 3.2 Architettura a tre layer

Il backend segue una separazione chiara:

```text
api/         → resolver GraphQL, validazione input/output, permessi
domain/      → business logic
repository/  → accesso dati, modelli SQLAlchemy, query builder
```

La direzione delle dipendenze è:

```text
api → domain → repository
```

Questo riduce accoppiamento e rende più semplice intervenire su business logic, storage o protocollo API.

### 3.3 GraphQL schema-first

`schema.graphql` è la fonte canonica delle API.

Include:

- tipi dominio;
- enum;
- input;
- paginazioni;
- result payload;
- errori strutturati;
- query;
- mutation.

Le mutation seguono il pattern:

```graphql
Result {
  success
  error
  payload
}
```

Dove possibile, gli errori sono strutturati con codice prevedibile.

### 3.4 Autenticazione e autorizzazione

L'autenticazione avviene tramite JWT.

Il backend usa middleware/decorator per:

- validare utente autenticato;
- verificare ruoli globali;
- verificare ruoli specifici shelter.

Per il modulo shelter sono previsti ruoli specifici:

```text
VOLUNTEER → lettura
STAFF     → operazioni quotidiane
MANAGER   → task, box, inventory, persone
OWNER     → info shelter, ruoli, ownership
ADMIN     → azioni di sistema
```

Il ruolo `ADMIN` globale può bypassare le verifiche shelter.

---

## 4. Dominio principale Graph-a-Pet

Il dominio base gestisce:

- utenti;
- pet;
- ownership/custodia condivisa;
- health card;
- treatment;
- cure;
- walk;
- report;
- media;
- codici/inviti;
- statistiche;
- notifiche interne;
- rifugi e workspace.

### 4.1 Pets e ownership

Un pet può essere collegato a uno o più utenti tramite ownership/custodia.

I ruoli principali includono:

```text
OWNER
SUB_OWNER
PET_SITTER
```

Sono supportati inviti a prendere possesso/custodia di un pet. Questi inviti generano notifiche interne e devono essere accettati/rifiutati dall'utente destinatario.

### 4.2 Treatments e reminder

I trattamenti sono usati anche per generare notifiche interne.

I reminder automatici sono limitati a:

```text
VACCINE
OPERATION
ANTIPARASITIC
```

L'obiettivo è evitare rumore notifiche e mantenere solo eventi realmente importanti.

---

## 5. Modulo Shelter Management

Il modulo Shelter è una piattaforma operativa per rifugi.

Gestisce:

- rifugi ufficiali;
- workspace personali;
- ruoli;
- persone con o senza account;
- pet ospitati;
- box e occupazioni;
- mappa 2D;
- task ricorrenti;
- passeggiate;
- inventario;
- dashboard operativa;
- notifiche;
- inviti;
- candidature;
- trasferimenti ownership;
- claim/verifica ufficiale.

---

## 6. Shelter: tipologia, visibilità e verifica

Ogni shelter/workspace ha tre dimensioni principali.

### 6.1 ShelterType

```text
OFFICIAL_SHELTER
PERSONAL_WORKSPACE
```

- `OFFICIAL_SHELTER`: rifugio/canile/gattile reale, potenzialmente verificato;
- `PERSONAL_WORKSPACE`: spazio privato creato da un utente per organizzare attività anche se il rifugio reale non usa l'app.

### 6.2 ShelterVerificationStatus

```text
UNVERIFIED
PENDING_CLAIM
VERIFIED
REJECTED
```

Serve a distinguere spazi personali o rifugi non verificati da rifugi ufficialmente riconosciuti.

### 6.3 ShelterVisibility

```text
PRIVATE
UNLISTED
PUBLIC
```

- `PRIVATE`: visibile solo ai membri collegati;
- `UNLISTED`: accessibile solo tramite link/codice;
- `PUBLIC`: visibile nella discovery pubblica.

Regola chiave:

```text
Uno spazio personale non verificato non deve apparire nella discovery pubblica.
```

---

## 7. Personal workspace

Un utente può creare uno spazio personale quando collabora con un canile che non usa ancora l'app.

Alla creazione:

```text
type = PERSONAL_WORKSPACE
verification_status = UNVERIFIED
visibility = PRIVATE
creator = OWNER tecnico
```

Il workspace personale consente:

- creare pet seguiti personalmente;
- assegnare task;
- registrare passeggiate;
- gestire note e promemoria;
- invitare collaboratori privati;
- organizzarsi senza coinvolgere ufficialmente il canile.

Non consente:

- apparire pubblicamente come rifugio ufficiale;
- ricevere candidature pubbliche;
- dichiararsi verificato;
- esporre dati operativi a utenti esterni.

---

## 8. Public shelter discovery

La discovery pubblica è separata da `/shelters`.

- `/shelters`: mostra solo i rifugi/workspace dell'utente;
- `/shelters/discover`: ricerca pubblica controllata;
- `/shelters/public/:id`: scheda pubblica limitata.

La discovery mostra solo shelter con:

```text
visibility = PUBLIC
verification_status valido
```

La scheda pubblica può mostrare:

- nome;
- città/zona;
- descrizione pubblica;
- logo/immagine;
- contatti pubblici se abilitati;
- indicazione se accetta volontari;
- posizione approssimata se configurata.

Non deve mostrare:

- task;
- inventory;
- mappa interna;
- box;
- occupazioni;
- persone/staff;
- dashboard operativa;
- pet interni, salvo scelta esplicita futura.

---

## 9. Shelter people e members

La gestione persone è consolidata nella pagina:

```text
/shelters/detail/:id/people
```

La pagina distingue due concetti.

### 9.1 Members

Sono utenti reali dell'app collegati tramite `ShelterRole`.

Contengono:

- utente;
- ruolo;
- eventuali azioni di gestione ruolo;
- rimozione/declassamento se permesso.

Sono il vero perimetro operativo dei permessi shelter.

### 9.2 Contacts / Visitors

Sono persone esterne o offline gestite tramite `ShelterPerson`.

Possono essere:

- visitatori;
- potenziali volontari;
- potenziali adottanti;
- donatori;
- persone invitate ma non ancora registrate;
- persone che hanno svolto attività registrate da uno staff member.

### 9.3 ShelterPerson

Campi principali:

```text
id
shelter_id
user_id nullable
first_name
last_name
email nullable
phone nullable
status
source
notes
created_by
archived_at
archived_by
created_at
updated_at
```

Stati:

```text
VISITOR
PENDING_INVITE
ACTIVE_USER
ARCHIVED
```

Fonti:

```text
MANUAL
INVITE
VISIT
VOLUNTEER_REQUEST
IMPORT
```

Regole:

- non crea account fittizi;
- email opzionale;
- almeno un identificatore utile richiesto;
- se collegato a un `User`, diventa `ACTIVE_USER`;
- archiviazione soft.

---

## 10. Inviti

Il sistema distingue inviti e ruoli effettivi.

### 10.1 Invito pet

Un utente può essere invitato a prendere custodia/ownership di un pet.

La notifica generata contiene:

```text
type = PET_OWNERSHIP_INVITE
entity_type = OWNERSHIP
pet_id
actor_user_id
payload.role
payload.pet_name
action_url
dedupe_key
```

L'accesso reale viene assegnato solo dopo accettazione backend-side.

### 10.2 Invito shelter

Un utente può essere invitato a entrare in uno shelter con un ruolo.

La notifica generata contiene:

```text
type = SHELTER_INVITE
entity_type = SHELTER_INVITE
shelter_id
actor_user_id
payload.role
payload.shelter_name
action_url
dedupe_key
```

Anche qui il ruolo effettivo viene creato solo tramite flusso autorizzato lato backend.

---

## 11. Richieste di volontariato

Le richieste di volontariato sono gestite tramite `ShelterJoinRequest`.

Campi principali:

```text
id
shelter_id
user_id
requested_role
message
status
reviewed_by
reviewed_at
decision_note
created_at
updated_at
```

Stati:

```text
PENDING
APPROVED
REJECTED
CANCELLED
```

Regole:

- l'utente può candidarsi solo a shelter che accettano volontari;
- ruolo di default: `VOLUNTEER`;
- vietate richieste pendenti duplicate per stesso utente/shelter;
- l'utente può annullare la propria richiesta pendente;
- `MANAGER` o `OWNER` possono approvare/rifiutare;
- l'approvazione crea `ShelterRole`;
- creazione, approvazione e rifiuto generano notifiche interne.

---

## 12. Ownership transfer

Il trasferimento ownership permette di passare il controllo tecnico di uno shelter/workspace a un altro utente.

Entità:

```text
ShelterOwnershipTransfer
```

Campi principali:

```text
id
shelter_id
from_user_id
to_user_id
new_role_for_previous_owner
status
created_at
accepted_at
rejected_at
cancelled_at
expires_at
```

Stati:

```text
PENDING
ACCEPTED
REJECTED
CANCELLED
EXPIRED
```

Regole:

- solo un `OWNER` può richiedere il trasferimento;
- il destinatario deve esistere;
- il destinatario deve accettare;
- uno shelter deve sempre avere almeno un `OWNER`;
- all'accettazione, il destinatario diventa `OWNER`;
- il precedente owner viene declassato o rimosso secondo opzione;
- viene generata notifica;
- viene scritto audit log se disponibile.

---

## 13. Claim e verifica ufficiale

Il claim permette a un responsabile reale di rivendicare uno spazio personale o uno shelter non verificato.

Entità:

```text
ShelterClaimRequest
```

Campi principali:

```text
id
shelter_id
requester_user_id
status
proof_data
message
reviewed_by
reviewed_at
decision_note
created_at
updated_at
```

Stati:

```text
PENDING
APPROVED
REJECTED
CANCELLED
```

Regole:

- l'utente può rivendicare `PERSONAL_WORKSPACE` o `OFFICIAL_SHELTER` non verificato;
- vietati claim pendenti duplicati dello stesso utente sullo stesso shelter;
- solo admin approva/rifiuta;
- approvazione:
  - imposta `type = OFFICIAL_SHELTER`;
  - imposta `verification_status = VERIFIED`;
  - assegna requester come `OWNER`;
  - regola eventuale owner tecnico precedente;
  - notifica gli utenti coinvolti;
  - registra audit log se disponibile;
- rifiuto:
  - mantiene invariati ruoli e stato shelter;
  - notifica il requester.

---

## 14. Box e occupazioni

Il modulo shelter gestisce box e occupazioni pet.

Regole principali:

- un pet non può avere due occupazioni attive;
- un box non può superare la capacità;
- un box `OUT_OF_SERVICE` non può ricevere pet;
- un box con pet attivi non può essere eliminato;
- `assignPetToBox` fallisce se il pet è già assegnato;
- `movePetBetweenBoxes` chiude la vecchia occupazione e crea la nuova in una transazione;
- `releasePetFromBox` chiude l'occupazione;
- ogni movimento deve salvare actor, reason e timestamp.

Stati box:

```text
AVAILABLE
OCCUPIED
FULL
OUT_OF_SERVICE
NEEDS_CLEANING
```

---

## 15. Shelter task

I task shelter supportano ricorrenze e istanze operative.

Stati task:

```text
PENDING
COMPLETED
SKIPPED
CANCELLED
OVERDUE
```

Regole:

- i task ricorrenti hanno template e istanze, oppure modello unico con parent/template;
- `completeShelterTask` e `skipShelterTask` lavorano sulle istanze, non sui template;
- il cron delle 2:00 è idempotente;
- massimo una istanza per template e giorno pianificato;
- duplicate prevention tramite vincolo o controllo equivalente.

---

## 16. Shelter walks

Le passeggiate shelter hanno stati:

```text
PLANNED
IN_PROGRESS
COMPLETED
CANCELLED
```

Flusso:

1. walk pianificata;
2. start → `IN_PROGRESS`;
3. complete → `COMPLETED`, con durata calcolata;
4. cancel → `CANCELLED`.

La dashboard può calcolare pet che necessitano passeggiata in base all'ultima walk completata e alla soglia temporale.

---

## 17. Inventory

L'inventario shelter è movement-based.

Tipi movimento:

```text
RESTOCK
DONATION
CONSUMPTION
WASTE
ADJUSTMENT
```

Regole:

- quantità corrente = somma movimenti;
- niente delete fisico se l'item ha movimenti;
- item archiviabili con:
  - `is_active`;
  - `archived_at`;
  - `archived_by`;
- i movimenti storici non si cancellano;
- le correzioni usano movimenti compensativi;
- stock sotto zero bloccato salvo override autorizzato;
- low stock calcolato tramite soglia minima.

---

## 18. Shelter operational dashboard

La dashboard operativa dello shelter aggrega metriche leggibili.

Metriche previste:

```text
pending tasks
completed tasks today
skipped tasks today
overdue tasks
planned walks
in-progress walks
completed walks today
pets needing walk
total boxes
available boxes
full boxes
out-of-service boxes
boxes needing cleaning
occupancy rate
low stock count
low stock list
```

La dashboard deve usare il timezone dello shelter quando disponibile.

---

## 19. Internal notification inbox

Le notifiche sono interne all'app e persistenti nel database.

Non sono push native, email o Firebase push.

### 19.1 Notification

Campi principali:

```text
id
user_id
type
status
priority
title
message
entity_type
entity_id
action_url
actor_user_id
shelter_id
pet_id
payload
dedupe_key
scheduled_at
read_at
dismissed_at
expires_at
created_at
updated_at
```

### 19.2 Tipi notifica

```text
TREATMENT_REMINDER
PET_OWNERSHIP_INVITE
SHELTER_INVITE
SHELTER_TASK_INSTANCE
SHELTER_JOIN_REQUEST
PET_BIRTHDAY
```

### 19.3 Stati

```text
UNREAD
READ
DISMISSED
EXPIRED
```

### 19.4 Priorità

```text
LOW
NORMAL
HIGH
URGENT
```

### 19.5 Entity type

```text
PET
TREATMENT
OWNERSHIP
SHELTER
SHELTER_INVITE
SHELTER_TASK
SHELTER_JOIN_REQUEST
```

### 19.6 Regole

- la notifica non è la fonte dati;
- punta sempre all'entità reale;
- `payload` contiene solo dati display;
- `dedupe_key` evita duplicati;
- niente delete fisico utente: si usa `DISMISSED`;
- cron idempotente per reminder e compleanni.

### 19.7 Frontend notifiche

La UI include:

- `/notifications`;
- campanella nel layout autenticato;
- badge non lette;
- lista notifiche newest first;
- tap → mark as read + navigazione a `action_url`;
- mark as read;
- mark all as read;
- dismiss;
- dismissed nascoste dalla lista default;
- lette ancora visibili finché non dismissate.

---

## 20. Errori GraphQL strutturati

Gli errori GraphQL devono essere prevedibili e consumabili dal frontend.

Codici rilevanti:

```text
UNAUTHORIZED
FORBIDDEN
NOT_FOUND
VALIDATION_ERROR
BOX_FULL
BOX_OUT_OF_SERVICE
PET_ALREADY_ASSIGNED
PET_NOT_ASSIGNED
INSUFFICIENT_STOCK
DUPLICATE_TASK_INSTANCE
INVALID_RECURRENCE_RULE
CANNOT_DELETE_WITH_ACTIVE_OCCUPANCY
CANNOT_DELETE_WITH_HISTORY
```

Il frontend deve mostrare messaggi backend quando presenti, senza sostituire la logica autorizzativa.

---

## 21. Flussi utente principali

### 21.1 Utente senza rifugi

L'empty state propone:

```text
Cerca rifugio
Inserisci codice invito
Crea spazio personale
```

Solo le azioni supportate dal backend devono essere wired. Le altre possono essere disabilitate o nascoste finché non operative.

### 21.2 Utente crea workspace personale

```text
User → createPersonalWorkspace → Shelter PERSONAL_WORKSPACE PRIVATE UNVERIFIED → creator OWNER tecnico
```

### 21.3 Responsabile prende ownership

```text
Owner tecnico → request ownership transfer → destinatario accetta → nuovo OWNER → precedente owner declassato/rimosso
```

### 21.4 Responsabile rivendica ufficialità

```text
Requester → ShelterClaimRequest → admin review → approvazione → OFFICIAL_SHELTER VERIFIED
```

### 21.5 Utente si candida come volontario

```text
User → ShelterJoinRequest → notifica manager/owner → approvazione → ShelterRole VOLUNTEER
```

### 21.6 Persona senza app entra nel rifugio

```text
Staff/Manager → create ShelterPerson → eventuale invito → registrazione futura → link a User
```

---

## 22. Confini concettuali importanti

### Notification vs domain entity

```text
Notification = evento da mostrare all'utente
Domain entity = verità operativa
```

La notifica non deve sostituire invite, task, treatment, join request o claim.

### ShelterPerson vs User

```text
ShelterPerson = persona conosciuta dallo shelter, anche offline
User = account app reale
ShelterRole = accesso operativo reale
```

Non creare utenti fittizi per persone senza app.

### Personal workspace vs official shelter

```text
PERSONAL_WORKSPACE = spazio privato organizzativo
OFFICIAL_SHELTER = rifugio ufficiale/verificabile
```

Il workspace personale non deve apparire come rappresentanza ufficiale.

### Discovery vs My shelters

```text
/shelters = solo rifugi/workspace dell'utente
/shelters/discover = directory pubblica controllata
```

La discovery non deve esporre dati operativi.

---

## 23. Stato prodotto risultante

Con queste estensioni, Graph-a-Pet non è solo una PWA per pet owner, ma una piattaforma modulare con tre livelli di valore:

1. **Pet owner app**  
   Gestione pet, trattamenti, custodia, promemoria, compleanni, segnalazioni.

2. **Volunteer/workspace tool**  
   Spazi personali per volontari o piccoli gruppi che vogliono organizzarsi anche senza onboarding ufficiale del rifugio.

3. **Shelter operating system**  
   Rifugi ufficiali con ruoli, persone, box, task, walk, inventory, dashboard, discovery, candidature, notifiche e verifica.

La direzione architetturale è coerente: il frontend rimane mobile-first e modulare, mentre il backend mantiene separazione tra GraphQL API, domain logic e repository. I nuovi flussi risolvono il problema centrale di collegare in modo naturale utenti, rifugi, persone offline, volontari e responsabili reali senza compromettere permessi, privacy o qualità dei dati.
