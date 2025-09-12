import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanstackDevtools } from "@tanstack/react-devtools";

import { AuthProvider } from "../lib/auth-context";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";

import type { QueryClient } from "@tanstack/react-query";

interface MyRouterContext {
    queryClient: QueryClient;
}

function RootComponent() {
    return (
        <>
            <Outlet />
            {/* <TanstackDevtools
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
            /> */}
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
