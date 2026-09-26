"use client";

import styles from "./GradientButton.module.css";

const layers = [
  { delay: 0, duration: 25 },
  { delay: 0.15, duration: 15.9 },
  { delay: 0.53, duration: 26.4 },
  { delay: 0.45, duration: 17.8 },
  { delay: 1.6, duration: 19.2 },
  { delay: 1.6, duration: 29.2 },
  { delay: 1.6, duration: 20.2 },
];

export default function GradientButton({ label = "Start", onClick, className = "", ...props }) {
  return (
    <div className={`${styles.btnWrapper} ${className}`}>
      <div className={styles.light} />

      {layers.map((layer, i) => (
        <div
          key={i}
          className={styles.gradientLayer}
          style={{
            animationDelay: `${layer.delay}s`,
            animationDuration: `${layer.duration}s`,
          }}
        />
      ))}

      <button type="button" className={styles.gradientBtn} onClick={onClick} {...props}>
        {label}
      </button>

      <div className={styles.textOverlay}>{label}</div>
    </div>
  );
}
