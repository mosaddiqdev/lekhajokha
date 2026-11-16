import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { WIDE } from "../ui/viewport";
import { depth, parseRoute, type Route } from "./route";

export function useRoute(): Route {
  const [route, setRoute] = useState(() => parseRoute(location.hash));

  useEffect(() => {
    const onChange = () => {
      const next = parseRoute(location.hash);
      const apply = () =>
        flushSync(() =>
          setRoute((current) => {
            // The slide direction is read before the screen changes.
            document.documentElement.dataset.nav =
              depth(next) > depth(current) ? "forward" : "back";
            return next;
          }),
        );

      const still =
        matchMedia(WIDE).matches ||
        matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (document.startViewTransition && !still) document.startViewTransition(apply);
      else apply();
    };
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  return route;
}
