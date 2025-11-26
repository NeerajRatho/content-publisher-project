import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "../screens/Login";
import Signup from "../screens/Signup";
import PublicationsList from "../screens/PublicationsList";
import AddPublication from "../screens/AddPublication";
import EditPublication from "../screens/EditPublication";
import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <PublicationsList />
      </ProtectedRoute>
    ),
  },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  {
    path: "/add",
    element: (
      <ProtectedRoute>
        <AddPublication />
      </ProtectedRoute>
    ),
  },
  {
    path: "/edit/:id",
    element: (
      <ProtectedRoute>
        <EditPublication />
      </ProtectedRoute>
    ),
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
