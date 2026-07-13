import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FileText, X } from "lucide-react";
import { SITE } from "../data/site";

export default function ResumeModal() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    closeButtonRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab" || !modalRef.current) return;

      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'button, a[href], iframe, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="btn btn-primary"
        onClick={() => setOpen(true)}
      >
        <FileText size={18} />
        View Resume
      </button>
      {open &&
        createPortal(
          <div className="resume-modal-backdrop" onClick={() => setOpen(false)}>
            <div
              ref={modalRef}
              className="resume-modal"
              role="dialog"
              aria-modal="true"
              aria-label="Resume"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                ref={closeButtonRef}
                type="button"
                className="resume-modal-close"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
              <iframe src={SITE.resumeHref} title="Resume" className="resume-modal-frame" />
              <a
                href={SITE.resumeHref}
                target="_blank"
                rel="noopener noreferrer"
                className="resume-modal-fallback"
              >
                Open in a new tab
              </a>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
