# Graph-a-Pet — Project Context

## 1. Product

**Graph-a-Pet** is a modular pet and shelter management platform.

Main product layers:

1. **Pet Owner App**

   * Pets
   * Shared custody/ownership
   * Health data
   * Treatments and reminders
   * Events
   * Reports
   * Internal notifications

2. **Personal Workspace**

   * Private shelter-like workspace
   * Volunteer/small-team coordination
   * Pets, tasks, walks, notes
   * No official or public representation

3. **Shelter OS**

   * Official shelter operations
   * Members and external people
   * Pets and boxes
   * Tasks and walks
   * Inventory
   * Internal maps
   * Operational dashboard
   * Applications, invitations, claims and ownership transfers

---

## 2. Applications

### Mobile App

**Stack**

* Ionic + React
* TypeScript
* Vite
* Apollo Client
* GraphQL Codegen
* Capacitor-ready
* i18next
* styled-components
* Leaflet

**Architecture**

* Mobile-first PWA
* Feature-based modules
* JWT authentication
* GraphQL-only data layer
* Backend-driven permissions
* Protected routes
* Internal notification inbox

### Back Office

**Stack**

* Next.js 14+ App Router
* Apollo Client 3.x
* GraphQL Codegen
* styled-components v6
* `@lemaks/grid_system`
* `@tanstack/react-table` (data tables)
* Node 22 portable environment

**Main shelter sections**

* Map
* Boxes
* Inventory
* Tasks
* Walks
* Pets
* People
* Members

The map is an interactive SVG editor supporting zones, areas, boxes and fixed elements.

**Pets**

* Create/edit forms allow assigning a pet to an owner and/or a shelter; neither is mandatory.
* Pet detail page has a dedicated "Rifugio" tab to assign/remove a shelter link independently of ownership.

**Theming**

* Light/dark theme via CSS custom properties, toggled through a `data-theme` attribute on `<html>`.
* Dark is the original/default palette; light is a parallel token set (same keys).
* Toggle lives in the topbar (left of the user name); choice persists in `localStorage`, with an inline no-flash script applying it before hydration.
* All components read colors through the shared `$color()` token helper — no hardcoded per-component colors.

**Layout**

* Sidebar is fixed (`position: fixed`, `height: 100dvh`) and does not scroll with the page.
* Only the main content area scrolls; the shell is clipped to the viewport height to avoid duplicated scrollbars.

**Data tables**

* Built on TanStack Table (`useReactTable`): manual sorting/pagination (backend stays authoritative), plus client-side column resizing and column visibility toggling.

### Backend

**Stack**

* Python
* Flask
* Ariadne
* GraphQL schema-first
* SQLAlchemy
* PostgreSQL
* Alembic
* APScheduler
* Redis optional
* JWT
* Gunicorn/Docker

**Layering**

```text
API → Domain → Repository
```

* `API`: GraphQL resolvers, validation, auth
* `Domain`: business logic
* `Repository`: DB models and queries

`schema.graphql` is the API source of truth.

---

## 3. Core Domain

Main entities:

* User
* Pet
* Ownership
* Health Card
* Treatment
* Cure
* Walk
* Report
* Media
* Shelter
* Shelter Role
* Shelter Membership
* Shelter Person
* Shelter Task
* Shelter Walk
* Shelter Box
* Box Occupancy
* Inventory Item
* Inventory Movement
* Notification
* Join Request
* Ownership Transfer
* Claim Request

Pet relationship roles:

```text
OWNER
SUB_OWNER
PET_SITTER
```

---

## 4. Shelter Model

### Types

```text
OFFICIAL_SHELTER
PERSONAL_WORKSPACE
```

### Verification

```text
UNVERIFIED
PENDING_CLAIM
VERIFIED
REJECTED
```

### Visibility

```text
PRIVATE
UNLISTED
PUBLIC
```

Rules:

* Personal workspaces default to private and unverified.
* Unverified personal workspaces cannot enter public discovery.
* Public shelter pages expose only public profile data.
* Operational data remains private.

---

## 5. People and Access

### User

A real application account.

### ShelterPerson

A known person without requiring an account.

Possible uses:

* Visitor
* Volunteer candidate
* Adopter candidate
* Donor
* Offline collaborator
* Pending invitee

No fake users must be created.

### ShelterMembership

Defines the user's shelter relationship lifecycle.

Statuses:

```text
INVITED
PENDING_ONBOARDING
ACTIVE
SUSPENDED
LEFT
REVOKED
```

### ShelterRole

Defines operational access within a shelter.

Legacy hierarchy:

```text
VOLUNTEER < STAFF < MANAGER < OWNER
```

---

## 6. RBAC

The system is migrating from role hierarchy to permission-based RBAC.

**Rule:** new authorization decisions must use permission keys, not role names.

### Scopes

```text
PLATFORM
SHELTER
```

### Permission format

```text
platform.<domain>.<action>
shelters.<domain>.<action>
```

Main shelter permission domains:

* Shelter info
* Members
* Roles
* People
* Pets
* Medical data
* Tasks
* Walks
* Inventory
* Boxes
* Map
* Ownership
* Claims

Main system roles:

```text
PLATFORM_USER
SHELTER_VOLUNTEER
SHELTER_STAFF
SHELTER_MANAGER
SHELTER_ADMIN
PLATFORM_ADMIN
```

Authorization rules:

* Deny by default.
* Shelter permissions require a shelter scope.
* Platform permissions cannot use shelter scope.
* Assignments must be active and valid.
* Shelter permissions require active membership.
* Platform admins receive all permissions.
* High-risk denials are audited.
* Permission results are cached per request.
* Tenant/entity consistency remains a domain responsibility.

Frontend rules:

* Fetch effective permissions from the backend.
* Never infer access from role names.
* Hide unauthorized UI actions.
* Always enforce permissions again on the backend.
* Refetch permissions after role or membership changes.

---

## 7. Shelter Operations

### Pets and Boxes

Rules:

* One active box occupancy per pet.
* Box capacity cannot be exceeded.
* Out-of-service boxes reject assignments.
* Boxes with active occupants cannot be deleted.
* Moves must be transactional.
* Movements store actor, reason and timestamp.

Box states:

```text
AVAILABLE
OCCUPIED
FULL
OUT_OF_SERVICE
NEEDS_CLEANING
```

### Tasks

States:

```text
PENDING
COMPLETED
SKIPPED
CANCELLED
OVERDUE
```

Rules:

* Recurring tasks generate operational instances.
* Completion/skip applies to instances.
* Scheduled generation must be idempotent.
* Max one instance per template and scheduled day.

Backend datetime format:

```text
YYYY-MM-DDTHH:mm:ss.sssZ
```

### Walks

States:

```text
PLANNED
IN_PROGRESS
COMPLETED
CANCELLED
```

Flow:

```text
Plan → Start → Complete
Plan/In progress → Cancel
```

### Inventory

Movement types:

```text
RESTOCK
DONATION
CONSUMPTION
WASTE
ADJUSTMENT
```

Rules:

* Stock is derived from movements.
* Historical movements are immutable.
* Corrections use compensating movements.
* Items with history are archived, not deleted.
* Negative stock requires authorized override.
* Low stock is threshold-based.

### Dashboard

Main metrics:

* Task status
* Walk status
* Pets requiring walks
* Box availability and occupancy
* Cleaning requirements
* Low stock
* Daily operational activity

Shelter timezone should be used where available.

---

## 8. Shelter Lifecycle Flows

### Personal Workspace

```text
User → Create workspace → PRIVATE + UNVERIFIED → Creator becomes technical owner
```

### Shelter Invitation

```text
Invite → User acceptance → Membership/role activation
```

### Volunteer Application

```text
Application → Manager/owner review → Approval → Active volunteer role
```

### Ownership Transfer

```text
Current owner request → Target acceptance → New owner → Previous owner downgraded/removed
```

A shelter must always retain at least one owner.

### Official Claim

```text
Claim request → Platform admin review → Approval → OFFICIAL_SHELTER + VERIFIED
```

### Offline Person Onboarding

```text
ShelterPerson → Optional invite → User registration → Account link
```

---

## 9. Notifications

Notifications are internal, persistent DB records.

No native push, email or Firebase dependency is required.

Types:

```text
TREATMENT_REMINDER
PET_OWNERSHIP_INVITE
SHELTER_INVITE
SHELTER_TASK_INSTANCE
SHELTER_JOIN_REQUEST
PET_BIRTHDAY
```

Statuses:

```text
UNREAD
READ
DISMISSED
EXPIRED
```

Priorities:

```text
LOW
NORMAL
HIGH
URGENT
```

Rules:

* Notification is not the domain source of truth.
* It references the real domain entity.
* Payload is display-only.
* `dedupe_key` prevents duplicates.
* User deletion is replaced by dismissal.
* Automated generation must be idempotent.

---

## 10. API Conventions

Mutation result pattern:

```text
success
error
payload/items
```

Main error codes:

```text
UNAUTHORIZED
FORBIDDEN
NOT_FOUND
VALIDATION_ERROR
MEMBERSHIP_NOT_ACTIVE
INVALID_AUTHORIZATION_SCOPE
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

Frontend requirements:

* Check `success` before reading payload.
* Display backend error messages when available.
* Handle forbidden responses even when UI actions are hidden.
* Use network refresh for mutable shelter lists.
* Avoid side effects during render.

---

## 11. Key Boundaries

```text
Notification ≠ Domain entity
ShelterPerson ≠ User
ShelterMembership ≠ Permission
ShelterRole ≠ Authorization source
Personal workspace ≠ Official shelter
Public discovery ≠ User shelter list
Frontend visibility ≠ Security
```

---

## 12. Current Direction

The target architecture is:

* Mobile-first and modular frontend
* Separate operational back office
* Schema-first GraphQL API
* Explicit domain boundaries
* Permission-based RBAC
* Strict shelter tenant isolation
* Persistent internal notifications
* Idempotent scheduled processes
* Auditability for sensitive actions
* Clear separation between private workspaces and verified shelters
