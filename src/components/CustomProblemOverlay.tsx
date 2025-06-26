import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import "./CustomProblemOverlay.css";

export type OverlayData = {
  name: string;
  description: string;
  defaultText: string;
  tests: string;
};

type Props = {
  isOpen: boolean;
  onClose(): void;
  onSubmit(data: OverlayData): void;
  initialData: OverlayData;
  edit?: boolean;
};

const labels = ["Description", "Default Text", "Tests"];

export default function CustomProblemOverlay({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  edit = false,
}: Props) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<OverlayData>({
    name: "",
    description: "",
    defaultText: "",
    tests: "",
  });

  // any time initialData changes *and* the overlay is opening,
  // reset both step and form to the incoming values.
  useEffect(() => {
    if (isOpen) {
      setStep(0);
      setForm(initialData);
    }
  }, [initialData, isOpen]);

  // track “entered” state for animation
  const [entered, setEntered] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleMouseDown = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [isOpen, onClose]);

  // 1) Listen for ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  // 2) Trigger the “entered” flag on mount
  useEffect(() => {
    if (isOpen) {
      // small timeout ensures CSS can apply the initial style first
      const t = setTimeout(() => setEntered(true), 10);
      return () => clearTimeout(t);
    } else {
      setEntered(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isComplete = (i: number) => {
    switch (i) {
      case 0:
        return form.name.trim() !== "" && form.description.trim() !== "";
      case 1:
        return form.defaultText.trim() !== "";
      case 2:
        return form.tests.trim() !== "";
      default:
        return false;
    }
  };

  const resetOverlay = () => {
    setStep(0);
    setForm({ name: "", description: "", defaultText: "", tests: "" });
    setEntered(false);
  };

  const handleCreate = () => {
    onSubmit(form);
    resetOverlay();
    onClose();
  };

  return (
    <div className="overlay-backdrop-problemOverlay">
      <div
        ref={containerRef}
        className={
          "overlay-container-problemOverlay" + (entered ? " entered" : "")
        }
        onClick={(e) => e.stopPropagation()}
      >
        {/* TAB BAR */}
        <div className="overlay-tabs-problemOverlay">
          {labels.map((label, i) => (
            <button
              key={i}
              className={`tab-problemOverlay${step === i ? " active" : ""}`}
              disabled={i > 0 && ![...Array(i).keys()].every(isComplete)}
              onClick={() => setStep(i)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* HEADER */}
        <div className="overlay-header-problemOverlay">
          <h2 style={{ marginTop: "1rem" }}>New Custom Problem</h2>
          <X
            className="overlay-close-problemOverlay"
            onClick={onClose}
            size={20}
          />
        </div>

        {/* BODY */}
        <div className="overlay-body-problemOverlay">
          {step === 0 && (
            <div className="step-problemOverlay1">
              <label>Problem Name</label>
              <input
                type="text"
                value={form.name}
                maxLength={20}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
              />
              <label>Problem Description</label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    e.currentTarget.blur();
                  }
                }}
                onFocus={(e) => {
                  const len = e.currentTarget.value.length;
                  e.currentTarget.setSelectionRange(len, len);
                }}
              />
            </div>
          )}

          {step === 1 && (
            <div className="step-problemOverlay">
              <label>Default Solution File</label>
              <textarea
                value={form.defaultText}
                onChange={(e) =>
                  setForm((f) => ({ ...f, defaultText: e.target.value }))
                }
                onKeyDown={(e) => {
                  const isEnter = e.key === "Enter" && !e.shiftKey;
                  const isTab = e.key === "Tab";

                  if ((isEnter || isTab) && form.defaultText.trim() === "") {
                    e.preventDefault();
                    const placeholder = e.currentTarget.placeholder;
                    setForm((f) => ({ ...f, defaultText: placeholder }));
                  } else if (isEnter) {
                    e.preventDefault();
                    e.currentTarget.blur();
                  }
                }}
                onFocus={(e) => {
                  const len = e.currentTarget.value.length;
                  e.currentTarget.setSelectionRange(len, len);
                }}
                placeholder={`def solution():\n  pass`}
              />
            </div>
          )}

          {step === 2 && (
            <div className="step-problemOverlay">
              <label>Tests</label>
              <textarea
                value={form.tests}
                onChange={(e) =>
                  setForm((f) => ({ ...f, tests: e.target.value }))
                }
                onKeyDown={(e) => {
                  const isEnter = e.key === "Enter" && !e.shiftKey;
                  const isTab = e.key === "Tab";

                  if ((isEnter || isTab) && form.tests.trim() === "") {
                    e.preventDefault();
                    const placeholder = e.currentTarget.placeholder;
                    setForm((f) => ({ ...f, tests: placeholder }));
                  } else if (isEnter) {
                    e.preventDefault();
                    e.currentTarget.blur();
                  }
                }}
                onFocus={(e) => {
                  const len = e.currentTarget.value.length;
                  e.currentTarget.setSelectionRange(len, len);
                }}
                placeholder={`import unittest

class CommandExecutorTests(unittest.TestCase):
    def cases(self):
        //tests

    def test_edgeCases(self):
        //tests

    def test_invalid_input_format(self):
        //tests

if __name__ == "__main__":
    unittest.main()`}
              />
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="overlay-footer-problemOverlay">
          <button disabled={step === 0} onClick={() => setStep(step - 1)}>
            Back
          </button>

          {step < labels.length - 1 ? (
            <button
              disabled={!isComplete(step)}
              onClick={() => setStep(step + 1)}
            >
              Next
            </button>
          ) : (
            <button disabled={!isComplete(step)} onClick={handleCreate}>
              {edit ? "Update" : "Create"}
            </button>
          )}
          {edit && step < labels.length - 1 && (
            <button disabled={!isComplete(step)} onClick={handleCreate}>
              Update
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
