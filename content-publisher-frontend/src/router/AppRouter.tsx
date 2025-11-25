import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "../screens/Login";
import Signup from "../screens/Signup";
import PublicationsList from "../screens/PublicationsList";
import AddPublication from "../screens/AddPublication";
import EditPublication from "../screens/EditPublication";

const router = createBrowserRouter([
  { path: "/", element: <PublicationsList /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/add", element: <AddPublication /> },
  { path: "/edit/:id", element: <EditPublication /> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
