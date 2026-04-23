import { createRouter, useRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

function DefaultErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();

  return (
    <div>
      <h1>Error occurred</h1>
      <p>{error.message}</p>
      <button
        onClick={() => {
          router.invalidate();
          reset();
        }}
      >
        Retry
      </button>
    </div>
  );
}

const router = createRouter({
  routeTree,
  context: {},
  scrollRestoration: true,
  defaultPreloadStaleTime: 0,
  defaultErrorComponent: DefaultErrorComponent,
});

export { router };