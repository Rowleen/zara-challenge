import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "react-router-dom";
import "./button.sass";

type ButtonVariant = "solid" | "ghost" | "danger";

type ButtonBaseProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  className?: string;
  disabled?: boolean;
};

type ButtonAsButtonProps = ButtonBaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
    to?: never;
  };

type ButtonAsLinkProps = ButtonBaseProps & {
  to: string;
};

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

function getClassName(
  variant: ButtonVariant,
  fullWidth: boolean,
  disabled: boolean | undefined,
  className: string | undefined,
) {
  return [
    "button",
    `button--${variant}`,
    fullWidth ? "button--full" : null,
    disabled ? "is-disabled" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

export function Button({
  children,
  variant = "solid",
  fullWidth = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const classes = getClassName(variant, fullWidth, disabled, className);

  if ("to" in props && props.to != null) {
    if (disabled) {
      return (
        <span className={classes} aria-disabled="true">
          {children}
        </span>
      );
    }

    return (
      <Link to={props.to} className={classes}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as Omit<ButtonAsButtonProps, keyof ButtonBaseProps>;

  return (
    <button
      {...buttonProps}
      type={buttonProps.type ?? "button"}
      className={classes}
      disabled={disabled}
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
}
