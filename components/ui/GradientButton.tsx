import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./GradientButton.module.css";

type GradientButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
};

export default function GradientButton({
  children = "Start",
  className,
  type = "button",
  ...props
}: GradientButtonProps) {
  return (
    <button className={`${styles.button} ${className ?? ""}`} type={type} {...props}>
      <span className={styles.light} aria-hidden="true" />
      {Array.from({ length: 7 }, (_, index) => (
        <span className={styles.gradientLayer} key={index} aria-hidden="true" />
      ))}
      <span className={styles.label}>{children}</span>
    </button>
  );
}