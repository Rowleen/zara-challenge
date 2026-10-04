import { Link } from "react-router-dom";
import arrowLeft from "@assets/arrow-left.svg";
import "./back-link.sass";

type BackLinkProps = {
  to?: string;
  label?: string;
};

export function BackLink({ to = "/", label = "BACK" }: BackLinkProps) {
  return (
    <Link to={to} className="back-link" aria-label="Go back to product list">
      <img src={arrowLeft} alt="" width={20} height={20} aria-hidden="true" />
      <span>{label}</span>
    </Link>
  );
}
