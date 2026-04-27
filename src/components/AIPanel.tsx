"use client";

import { CloseIcon, CopyIcon, SparkleIcon } from "@/lib/icons";
import type { AIResult } from "@/lib/types";

interface Props {
  state:
    | { phase: "loading"; kind: AIResult["kind"] }
    | { phase: "streaming"; kind: AIResult["kind"]; text: string }
    | { phase: "done"; result: AIResult }
    | null;
  onClose: () => void;
  onApply: () => void;
  onCopy: () => void;
  applyLabel?: string;
  copied?: boolean;
}

const TITLES: Record<AIResult["kind"], string> = {
  summary: "Summary",
  improve: "Suggested rewrite",
  expand: "Expanded draft",
  title: "Title suggestion",
  tags: "Suggested tags",
};

const SUBS: Record<AIResult["kind"], string> = {
  summary: "Pulled the through-line out of the note.",
  improve: "Tightened the same argument.",
  expand: "More context, supporting points, a counter.",
  title: "Short, descriptive — pick or edit.",
  tags: "Comma-separated. Click apply to save them.",
};

export function AIPanel({
  state,
  onClose,
  onApply,
  onCopy,
  applyLabel = "Apply",
  copied,
}: Props) {
  if (!state) return null;

  const kind = state.phase === "done" ? state.result.kind : state.kind;
  const text =
    state.phase === "loading"
      ? ""
      : state.phase === "streaming"
      ? state.text
      : state.result.content;
  const meta = state.phase === "done" ? state.result.meta : null;

  return (
    <aside className="ai-panel">
      <div className="ai-panel-head">
        <div className="ai-panel-title">
          <span className="ai-panel-title-glyph">
            <SparkleIcon />
          </span>
          {TITLES[kind]}
        </div>
        <button
          type="button"
          className="icon-btn"
          onClick={onClose}
          aria-label="Close panel"
        >
          <CloseIcon />
        </button>
      </div>
      <div className="ai-panel-body">
        {state.phase === "loading" && (
          <div className="ai-loading">
            <span className="ai-loading-dots">
              <span /><span /><span />
            </span>
            Thinking
          </div>
        )}

        {state.phase !== "loading" && (
          <>
            <p
              style={{
                fontSize: 12.5,
                color: "var(--ink-500)",
                margin: "0 0 14px",
              }}
            >
              {SUBS[kind]}
            </p>

            <div className="ai-output-card gradient-edge">{text || " "}</div>

            {meta && state.phase === "done" && (
              <div className="ai-output-meta">
                <span>{meta.tokens} tokens</span>
                <span>·</span>
                <span>{meta.model}</span>
              </div>
            )}

            <div className="ai-actions">
              <button
                type="button"
                className="btn"
                onClick={onCopy}
                disabled={state.phase !== "done"}
                data-feedback-id="ai-copy"
              >
                <CopyIcon className="btn-icon" />
                {copied ? "Copied" : "Copy"}
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={onApply}
                disabled={state.phase !== "done"}
                data-feedback-id="ai-apply"
              >
                <SparkleIcon className="btn-icon" />
                {applyLabel}
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
