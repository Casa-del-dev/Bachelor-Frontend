import { useState } from "react";
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
};

const labels = ["Description", "Default Text", "Tests"];

export default function CustomProblemOverlay({
  isOpen,
  onClose,
  onSubmit,
}: Props) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<OverlayData>({
    name: "",
    description: "",
    defaultText: "",
    tests: "",
  });

  if (!isOpen) return null;

  const isComplete = (index: number) => {
    switch (index) {
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

  return (
    <div className="overlay-backdrop-problemOverlay">
      <div className="overlay-container-problemOverlay">
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
            <div className="step-problemOverlay">
              <label>Problem Name</label>
              <input
                type="text"
                value={form.name}
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
                  if (e.key === "Enter") {
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
              <label>Default Text</label>
              <textarea
                value={form.defaultText}
                onChange={(e) =>
                  setForm((f) => ({ ...f, defaultText: e.target.value }))
                }
              />
            </div>
          )}

          {step === 2 && (
            <div className="step-problemOverlay">
              <label>Tests (JSON or one per line)</label>
              <textarea
                value={form.tests}
                onChange={(e) =>
                  setForm((f) => ({ ...f, tests: e.target.value }))
                }
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
            <button
              disabled={!isComplete(step)}
              onClick={() => {
                onSubmit(form);
                onClose();
              }}
            >
              Create
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
