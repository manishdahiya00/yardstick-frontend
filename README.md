# Frontend

This is the frontend for the Yardstick Assignment project. It is built with React, Bun, Tailwind CSS, and shadcn/ui. The frontend provides a modern, responsive user interface for managing notes, user authentication, and plan-based features.

---

## Project Explanation

The frontend is a single-page application (SPA) that interacts with the backend API for authentication and notes management. It uses React for UI, Tailwind CSS and shadcn/ui for styling and components, and Axios for API requests. The app supports protected and public routes, and adapts its features based on the user's plan (FREE/PRO).

---

## Approach

- **React** is used for building a fast, interactive UI.
- **Bun** enables fast builds and development server.
- **shadcn/ui** and **Tailwind CSS** provide a modern, responsive design system.
- **API Layer**: Axios-based API client for communication with the backend.
- **Routing**: Protected and public routes for authentication flow.
- **State Management**: Context API for authentication and user state.

---

## Getting Started

To install dependencies:

```bash
bun install
```

To start a development server:

```bash
bun dev
```

To run for production:

```bash
bun start
```

---

This project was created using `bun init` in bun v1.2.21. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
