"use client";

import {
  CheckIcon,
  ExpandIcon,
  SparkleIcon,
  TagIcon,
  WandIcon,
} from "@/lib/icons";
import type { AIResult } from "@/lib/types";

interface Props {
  active: AIResult["kind"] | null;
  disabled: boolean;
  onRun: (kind: AIResult["kind"]) => void;
}

const ACTIONS: {
  kind: AIResult["kind"];
  label: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}[] = [
  { kind: "summary", label: "Summarise", Icon: CheckIcon },
  { kind: "improve", label: "Improve writing", Icon: WandIcon },
  { kind: "expand", label: "Expand", Icon: ExpandIcon },
  { kind: "title", label: "Suggest title", Icon: SparkleIcon },
  { kind: "tags", label: "Tag", Icon: TagIcon },
];

export function AIToolbar({ active, disabled, onRun }: Props) {
  return (
    <div className="ai-bar">
      <span className="ai-bar-label">
        <SparkleIcon />
        AI
      </span>
      {ACTIONS.map(({ kind, label, Icon }) => (
        <button
          key={kind}
          type="button"
          data-feedback-id={`ai-action-${kind}`}
          className={`ai-action${active === kind ? " active" : ""}`}
          disabled={disabled}
          onClick={() => onRun(kind)}
        >
          <Icon />
          {label}
        </button>
      ))}
    </div>
  );
}
