### 1. Create Form (Empty Form)

**Goal:** Logged-in user empty form create kar sake.

**Sub Steps:**

1. Protected route banao (`POST /api/forms`)
2. Auth middleware se current user nikalo
3. Request body se `title` aur `description` lo
4. Validation: title required hona chahiye
5. Unique slug generate karo (title se)
6. Form create karo with:
   - `userId` = current user
   - `state` = DRAFT
   - `version` = 1
   - `fields` = []
   - default settings
7. Success response return karo (created form)

---

### 2. Get All Forms

**Goal:** Logged-in user ke saare forms dikhao.

**Sub Steps:**

1. Protected route banao (`GET /api/forms`)
2. Current user id nikalo
3. Database se us user ke saare forms lao
4. Sorting: newest first
5. Response mein forms ki list return karo

---

### 3. Get Single Form (by ID)

**Goal:** Ek specific form ka data lao (edit ke liye).

**Sub Steps:**

1. Protected route banao (`GET /api/forms/[id]`)
2. Form id params se lo
3. Current user id nikalo
4. Form find karo (id + userId dono se) → security ke liye
5. Agar form na mile toh 404 error
6. Form data return karo

---

### 4. Update Form

**Goal:** Form ka title, description, fields, settings, state update kar sake.

**Sub Steps:**

1. Protected route banao (`PUT /api/forms/[id]`)
2. Form id + current user verify karo
3. Request body se update data lo (title, description, fields, settings, state)
4. Validation lagao
5. Agar state `PUBLISHED` ho raha hai toh version badhao (optional but recommended)
6. Form update karo
7. Updated form return karo

---

### 5. Delete / Archive Form

**Goal:** Form delete ya archive kar sake.

**Sub Steps:**

1. Protected route banao (`DELETE /api/forms/[id]`)
2. Form id + user ownership check karo
3. Soft delete prefer karo → `state = ARCHIVED` (recommended)
4. Ya hard delete (permanent)
5. Success message return karo

---

### Recommended Order of Building

1. Create Form
2. Get All Forms
3. Get Single Form
4. Update Form
5. Delete/Archive Form

# This Steps Are Completed 

**Haan, ab Frontend side pe move kar sakte hain.**

Lekin **seedha Drag & Drop builder mat banana**.

### Sahi Order (Frontend ke liye):

**Phase 1: Basic UI (Pehle yeh)**
1. Auth pages (Login + Register)
2. Dashboard layout (Sidebar + Header)
3. Forms List page (saare forms dikhao)
4. Create Form (simple title/description se)

**Phase 2: Form Builder UI**
- Drag & Drop canvas
- Field palette
- Properties panel

**Phase 3: Public Form + Submissions UI**

---

### Abhi kya start karein?

**Recommended:**  
Pehle **Auth pages + Dashboard layout + Forms List** banao.

Isse:
- App useable lagegi
- Tumhe flow clear hoga
- Builder banate waqt context pata hoga

---

**Bolo:**

1. Auth pages (Login/Register) se start karein?
2. Ya seedha Dashboard + Forms List se?

Kis se start karna hai?