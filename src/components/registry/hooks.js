import { useEffect, useContext } from "react";
import { RegistryContext } from "./QueryRegistry";

export function usePublishQuery(fn, type) {
  const { register, deregister } = useContext(RegistryContext);
  useEffect(() => {
    const id = register({ fn, type });
    return () => deregister(id);
  }, [register, deregister, fn, type]);
}

/**
 * Beware!! component using this hook won't be notified
 * when new fn is registered.
 * but this is not an issue in our use case.
 **/
export function useRegisteredQueries() {
  const { allQueries } = useContext(RegistryContext);
  return allQueries();
}
