import { Outlet, createRootRoute } from "@tanstack/react-router";
import { AuthProvider } from "@/context/AuthContext";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
