import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";

export function Wordmark({
  tone = "ink",
  className,
}: {
  tone?: "ink" | "light";
  className?: string;
}) {
  return (
    <Link to="/" className={cn("inline-flex items-center", className)} aria-label="Emir Pay home">
      <img src={logo} alt="Emir Pay" className="h-8 w-auto" />
    </Link>
  );
}
