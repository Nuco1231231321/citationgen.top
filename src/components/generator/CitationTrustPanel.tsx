"use client";

import { Database, WarningCircle, ListChecks } from "@phosphor-icons/react";

type TrustPanelProps = {
  sourceLabel?: string;
  warningCount: number;
  hasEditableFields: boolean;
};

export function CitationTrustPanel({
  sourceLabel,
  warningCount,
  hasEditableFields
}: TrustPanelProps) {
  return (
    <div className="grid gap-3">
      <div className={`trust-card ${sourceLabel ? "is-ready" : ""}`}>
        <span className="trust-icon" aria-hidden="true">
          <Database size={19} />
        </span>
        <div>
          <p>Source shown</p>
          <span>
            {sourceLabel
              ? `Result came from: ${sourceLabel}.`
              : "Source label will appear after generation."}
          </span>
        </div>
      </div>
      <div className={`trust-card ${warningCount > 0 ? "is-warning" : "is-ready"}`}>
        <span className="trust-icon" aria-hidden="true">
          <WarningCircle size={19} />
        </span>
        <div>
          <p>Missing fields flagged</p>
          <span>
            {warningCount > 0
              ? `${warningCount} field${warningCount !== 1 ? "s" : ""} missing. See the warnings above.`
              : "All required fields are present."}
          </span>
        </div>
      </div>
      <div className={`trust-card ${hasEditableFields ? "is-ready" : ""}`}>
        <span className="trust-icon" aria-hidden="true">
          <ListChecks size={19} />
        </span>
        <div>
          <p>Fields stay editable</p>
          <span>
            {hasEditableFields
              ? "Edit source details below, then regenerate."
              : "Fields will be editable after generation."}
          </span>
        </div>
      </div>
    </div>
  );
}
