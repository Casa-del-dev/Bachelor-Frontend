import { Pen, Trash2 } from "lucide-react";
import { problemDetailsMap } from "./BuildingBlocks/ProblemDetailsText";
import "./Problem_detail.css";
import CustomProblemOverlay, { OverlayData } from "./CustomProblemOverlay";
import React, { useEffect, useState } from "react";

interface ProblemMeta {
  id: string;
  name: string;
  description: string;
}

export interface ProblemPayload {
  id: string;
  name: string;
  description: string;
  defaultText: string;
  tests: string;
}

type ProblemDetailsProps = {
  items: ProblemMeta[];
  selectedProblem: string;
  refFirst?: React.Ref<HTMLButtonElement>;
  setCustomProblems: React.Dispatch<React.SetStateAction<ProblemMeta[]>>;
  setSelectedProblem: React.Dispatch<React.SetStateAction<string>>;
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default function Problem_details({
  items,
  selectedProblem,
  refFirst,
  setCustomProblems,
  setSelectedProblem,
}: ProblemDetailsProps) {
  const [pendingDelete, setPendingDelete] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState<OverlayData>({
    name: "",
    description: "",
    defaultText: "",
    tests: "",
  });

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // only fire if a problem is selected, delete‐dialog isn't already showing, and overlay isn’t open
      if (
        e.key === "Delete" &&
        selectedProblem &&
        !pendingDelete &&
        !isEditOpen &&
        UUID_RE.test(selectedProblem)
      ) {
        e.preventDefault();
        setPendingDelete(true);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [selectedProblem, pendingDelete, isEditOpen]);

  useEffect(() => {
    if (!pendingDelete) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPendingDelete(false);
      } else if (e.key === "Enter") {
        setPendingDelete(false);
        handleDeleteClick();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [pendingDelete]);

  // nothing selected yet
  if (!selectedProblem) {
    return (
      <div className="problem-details-container">
        <div className="problem-text-no-details">
          Please select a problem from the left.
        </div>
      </div>
    );
  }

  // look for a matching custom problem
  const custom = items.find((p) => p.id === selectedProblem);

  // decide title & description based on default vs custom
  const title = custom ? custom.name : selectedProblem;
  const details = custom
    ? custom.description
    : problemDetailsMap[selectedProblem]?.trim() || "No details available.";

  const handleCheckClick = () => {
    // save selection & navigate
    localStorage.setItem("selectedProblem", selectedProblem);
    localStorage.setItem("selectedSection", "Problem");
    window.location.href = `/start/${selectedProblem}`;
  };

  const handleEditClick = async () => {
    // 1) Hit the GET /customProblems/v1/:id endpoint
    const resp = await fetch(
      `https://bachelor-backend.erenhomburg.workers.dev/customProblems/v1/${selectedProblem}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      }
    );

    if (!resp.ok) {
      console.error("Failed to load full problem:", await resp.text());
      return;
    }

    // 2) Parse the full payload (it includes defaultText + tests)
    const full: ProblemPayload = await resp.json();

    // 3) Seed your editData and open the overlay
    setEditData({
      name: full.name,
      description: full.description,
      defaultText: full.defaultText,
      tests: full.tests,
    });
    setIsEditOpen(true);
  };

  const handleDeleteClick = async () => {
    try {
      const resp = await fetch(
        `https://bachelor-backend.erenhomburg.workers.dev/customProblems/v1/${selectedProblem}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (!resp.ok) {
        const err = await resp.text();
        throw new Error(err || resp.statusText);
      }

      // 1) remove from your local list
      setCustomProblems((prev) => prev.filter((p) => p.id !== selectedProblem));
      // 2) clear any stored selection
      if (localStorage.getItem("selectedProblem") === selectedProblem) {
        localStorage.removeItem("selectedProblem");
      }
      setSelectedProblem("");
    } catch (err) {
      console.error("Failed to delete problem:", err);
    }
  };

  return (
    <div className="problem-details-container">
      <div className="problem-title">
        <div className="inner-Title">
          {title}
          {custom && (
            <div className="inner-Title-icons">
              <Pen
                className="icon-problem-descripition"
                onClick={handleEditClick}
              />
              <Trash2
                className="icon-problem-descripition"
                onClick={() => setPendingDelete(true)}
              />
            </div>
          )}
        </div>
        <button
          className="check-button"
          ref={refFirst}
          onClick={handleCheckClick}
        >
          Solve
        </button>
      </div>

      <CustomProblemOverlay
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        initialData={editData} // ← pass in your pre-fill
        onSubmit={async (newData) => {
          try {
            // 1) Build the full payload with the same id:
            const payload: ProblemPayload = {
              id: selectedProblem, // ← reuse the original
              ...newData,
            };

            // 2) Send it to your backend as an update:
            const resp = await fetch(
              `https://bachelor-backend.erenhomburg.workers.dev/customProblems/v1/${selectedProblem}`,
              {
                method: "PUT", // or POST /save with the same id
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
                body: JSON.stringify(payload),
              }
            );
            if (!resp.ok) {
              const text = await resp.text();
              throw new Error(`Save failed: ${text}`);
            }

            setCustomProblems((prev) =>
              prev.map((p) => (p.id === payload.id ? payload : p))
            );

            setIsEditOpen(false);
          } catch (err) {
            console.error(err);
            alert("Could not save edits: " + err);
          }
        }}
        edit={true}
      />

      <pre className="problem-text">{details}</pre>

      {pendingDelete && (
        <div
          className="delete-overlay"
          onMouseDown={() => setPendingDelete(false)}
        >
          <div
            className="delete-dialog"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <p>Are you sure you want to delete this problem?</p>
            <button
              onClick={() => {
                setPendingDelete(false);
                handleDeleteClick();
              }}
            >
              Yes
            </button>
            <button onClick={() => setPendingDelete(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
