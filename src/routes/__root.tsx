import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanstackDevtools } from "@tanstack/react-devtools";

import { AuthProvider, useAuth } from "../lib/auth-context";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import { useNavigate } from "@tanstack/react-router";

import type { QueryClient } from "@tanstack/react-query";

interface MyRouterContext {
    queryClient: QueryClient;
}

function RootComponent() {
    const { user } = useAuth();
    const pathname = window.location.pathname;
    const navigate = useNavigate();

    if (!user && pathname !== "/login") {
        navigate({ to: "/login" });
    }

    return (
        <>
            <Outlet />
            <TanstackDevtools
                config={{
                    position: "bottom-left",
                }}
                plugins={[
                    {
                        name: "Tanstack Router",
                        render: <TanStackRouterDevtoolsPanel />,
                    },
                    TanStackQueryDevtools,
                ]}
            />
        </>
    );
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
    component: () => (
        <AuthProvider>
            <RootComponent />
        </AuthProvider>
    ),
});
