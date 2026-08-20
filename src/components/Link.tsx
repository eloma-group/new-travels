import { navigate } from "../router";

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & { to: string };

/** An <a> that keeps the SPA intact, while still being a real link for
 *  middle-click, ctrl-click, "open in new tab" and crawlers. */
export default function Link({ to, onClick, children, ...rest }: LinkProps) {
  const handle = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    const modified = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey;
    if (e.defaultPrevented || e.button !== 0 || modified) return;
    e.preventDefault();
    navigate(to);
  };

  return (
    <a href={to} onClick={handle} {...rest}>
      {children}
    </a>
  );
}
