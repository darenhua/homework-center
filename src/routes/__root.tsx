import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";

import { AuthProvider } from "../lib/auth-context";

import type { QueryClient } from "@tanstack/react-query";

interface MyRouterContext {
    queryClient: QueryClient;
}

function RootComponent() {
    return (
        <>
            <Outlet />
            <TanstackDevtools
                config={{
                    position: "middle-right",
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
