import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
import Login from "./pages/login";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./providers/AuthProvider";
import ProtectedRoute from "./Protectedroute";
import Users from "./pages/dashboard/users";
import { PublicRoute } from "./PublicRoute";
import Dashboard from "./pages/dashboard";
import Notes from "./pages/dashboard/notes";

export function App() {
  let router = createBrowserRouter([
    {
      path: "/",
      element: <PublicRoute />,
      children: [{ path: "", element: <Login /> }],
    },
    {
      path: "/login",
      element: <PublicRoute />,
      children: [{ path: "", element: <Login /> }],
    },
    {
      path: "/dashboard",
      element: <ProtectedRoute />,
      children: [
        {
          path: "",
          element: <Dashboard />,
          children: [
            {
              path: "users",
              element: <ProtectedRoute allowedRoles={["MANAGER"]} />,
              children: [{ path: "", element: <Users /> }],
            },
            {
              path: "notes",
              element: <Notes />,
            },
          ],
        },
      ],
    },
  ]);
  return (
    <>
      <AuthProvider>
        <Toaster position="top-right" reverseOrder={false} />
        <RouterProvider router={router} />
      </AuthProvider>
    </>
  );
}

export default App;
