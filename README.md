
# FinanceFlow Tracker - Backend Integration Guide

Since you're building the backend yourself, here is the API contract your server needs to satisfy.

## 🔗 Configuration
Update `services/apiClient.ts` with your server's URL.

## 🛠️ API Endpoints

### Authentication
- `POST /auth/register`
  - Body: `{ email, password }`
  - Response: `{ token: string, user: { uid: string, email: string, displayName: string } }`
- `POST /auth/login`
  - Body: `{ email, password }`
  - Response: `{ token: string, user: { uid: string, email: string, displayName: string } }`
- `GET /auth/me`
  - Header: `Authorization: Bearer <token>`
  - Response: `{ uid: string, email: string, displayName: string }`

### Expenses
- `GET /expenses`
  - Header: `Authorization: Bearer <token>`
  - Response: `Array<Expense>`
- `POST /expenses`
  - Body: `{ amount, category, description, date }`
  - Response: `Expense` (including generated `id`)
- `PUT /expenses/:id`
  - Body: `Partial<Expense>`
  - Response: `Expense`
- `DELETE /expenses/:id`
  - Response: `204 No Content`

### Budgets
- `GET /budgets`
  - Response: `Array<Budget>`
- `POST /budgets`
  - Body: `{ category, amount }`
  - Response: `Budget`

## 📊 Data Models (TypeScript)
Refer to `types.ts` for the exact object shapes. Use the same field names to ensure compatibility with the frontend.
