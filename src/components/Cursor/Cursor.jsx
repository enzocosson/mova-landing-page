import { useEffect, useRef } from "react";
import styles from "./Cursor.module.scss";

const Cursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const stateRef = useRef("default"); // default | hover | click

  useEffect(() => {
    let mouseX = 0,
      mouseY = 0;
    let posX = 0,
      posY = 0;
    let rafId;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onDown = () => {
      stateRef.current = "click";
      dotRef.current?.classList.add(styles.dotClick);
      ringRef.current?.classList.add(styles.ringClick);
    };

    const onUp = () => {
      stateRef.current = hoveredRef.current ? "hover" : "default";
      dotRef.current?.classList.remove(styles.dotClick);
      ringRef.current?.classList.remove(styles.ringClick);
    };

    // Hover sur éléments interactifs
    const hoveredRef = { current: false };
    const SELECTORS =
      "a, button, [data-cursor], input, textarea, select, label";

    const onEnter = () => {
      hoveredRef.current = true;
      dotRef.current?.classList.add(styles.dotHover);
      ringRef.current?.classList.add(styles.ringHover);
    };

    const onLeave = () => {
      hoveredRef.current = false;
      dotRef.current?.classList.remove(styles.dotHover);
      ringRef.current?.classList.remove(styles.ringHover);
    };

    // Délégation sur tout le document
    const onMoveDelegate = (e) => {
      onMove(e);
      const el = e.target.closest(SELECTORS);
      if (el && !hoveredRef.current) onEnter();
      else if (!el && hoveredRef.current) onLeave();
    };

    const tick = () => {
      const ease = stateRef.current === "default" ? 0.1 : 0.14;
      posX += (mouseX - posX) * ease;
      posY += (mouseY - posY) * ease;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${posX}px, ${posY}px)`;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    window.addEventListener("mousemove", onMoveDelegate);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mousemove", onMoveDelegate);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className={styles.dot} />
      <div ref={ringRef} className={styles.ring} />
    </>
  );
};

export default Cursor;
