# Trackier-Trello Clone

A Trello-like project management app built with React, Vite, Tailwind CSS (v4), and modern UI primitives—complete with authentication, drag-and-drop, and end-to-end tests.

---

## 🔗 Live Demo

[View the hosted demo on Vercel](https://trackier-trello.vercel.app/)

## 📁 Source Code

[GitHub Repository](https://github.com/Ashmit-cpp/trackier-trello)

---

## 🚀 Features

- **User Authentication**: Sign up, log in, and protected project routes using React Router and context.
- **Drag & Drop**: Smooth list and task reordering powered by `@hello-pangea/dnd`.
- **Task & List Management**: Create, edit, delete lists and tasks with contextual dialogs.
- **Form Validation**: Schema-based validation with Zod and React Hook Form.
- **Theme Toggle**: Light/dark mode switch leveraging Tailwind CSS v4 theming.
- **Custom UI Components**: Accessible primitives (Dialog, Input, Select, Button, Badge, etc.) built on Radix UI and ShadCN patterns.
- **Notifications**: Toast feedback using Sonner.
- **Responsive Design**: Mobile-first layouts with a custom `use-mobile` hook.

---

## 📦 Tech Stack

- **Frontend**: React 19, Vite
- **Styling**: Tailwind CSS v4, Tailwind-merge
- **Forms**: React Hook Form, Zod, @hookform/resolvers
- **Drag & Drop**: @hello-pangea/dnd
- **UI Primitives**: Radix UI, ShadCN patterns, Lucide React icons
- **State Management**: React Context API
- **Notifications**: Sonner
- **Testing**: Cypress (e2e)

---

## 🔧 Installation & Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/Ashmit-cpp/trackier-trello.git
   cd trackier-trello
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Run in development**
   ```bash
   pnpm dev
   ```
   The app will be available at `http://localhost:4173`.

4. **Build for production**
   ```bash
   pnpm build
   ```

---

## ✅ Testing

- **Open Cypress UI**:
  ```bash
  pnpm exec cypress open
  ```
- **Run all tests headlessly**:
  ```bash
  pnpm exec cypress run
  ```

Test specs are located in `cypress/e2e/`:
- `auth.spec.cy.js` – authentication flows
- `creation.spec.cy.js` – list & task creation
- `dragAndDrop.spec.cy.js` – drag-and-drop interactions

---

## 📂 Project Structure

```text
trackier-trello-clone
├── cypress/               # E2E tests (fixtures, specs, commands)
├── public/                # Static assets
├── src/
│   ├── components/        # UI & feature components
│   ├── context/           # React contexts (Auth, Project)
│   ├── hooks/             # Custom hooks
│   ├── lib/               # Utilities, types, and db setup
│   ├── pages/             # App pages (Auth, Dashboard, Project)
│   └── main.tsx           # Entry point
├── vite.config.ts
├── cypress.config.js
├── package.json
└── tsconfig.json
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to:

1. Fork the repo
2. Create a branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

© 2025 Ashmit Sharma. All rights reserved.

