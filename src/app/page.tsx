"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Sidebar } from "@/components/Sidebar";
import { AIToolbar } from "@/components/AIToolbar";
import { AIPanel } from "@/components/AIPanel";
import { runAI } from "@/lib/mock-ai";
import { SAMPLE_NOTES } from "@/lib/mock-notes";
import type { AIResult, Note } from "@/lib/types";
import { FileTextIcon, FolderIcon, SparkleIcon, TagIcon } from "@/lib/icons";

type AIState =
  | { phase: "loading"; kind: AIResult["kind"] }
  | { phase: "streaming"; kind: AIResult["kind"]; text: string }
  | { phase: "done"; result: AIResult }
  | null;

const FOLDER_LABEL: Record<Note["folder"], string> = {
  personal: "Personal",
  work: "Work",
  ideas: "Ideas",
  archive: "Archive",
};

export default function Page() {
  const [notes, setNotes] = useState<Note[]>(SAMPLE_NOTES);
  const [selectedId, setSelectedId] = useState<string | null>(
    SAMPLE_NOTES[0]?.id ?? null
  );
  const [saving, setSaving] = useState(false);
  const [aiState, setAiState] = useState<AIState>(null);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const aiAbortRef = useRef<AbortController | null>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus textarea when entering edit mode
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      // Place cursor at the end
      const len = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(len, len);
    }
  }, [isEditing]);

  // Exit edit mode when switching notes
  useEffect(() => {
    setIsEditing(false);
  }, [selectedId]);

  const selected = useMemo(
    () => notes.find((n) => n.id === selectedId) ?? null,
    [notes, selectedId]
  );

  const updateSelected = useCallback(
    (patch: Partial<Note>) => {
      if (!selected) return;
      setSaving(true);
      setNotes((prev) =>
        prev.map((n) =>
          n.id === selected.id
            ? { ...n, ...patch, updatedAt: new Date().toISOString() }
            : n
        )
      );
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => setSaving(false), 600);
    },
    [selected]
  );

  function createNote() {
    const newNote: Note = {
      id: `n${Date.now()}`,
      title: "",
      content: "",
      tags: [],
      folder: "personal",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes((prev) => [newNote, ...prev]);
    setSelectedId(newNote.id);
    setAiState(null);
  }

  function closePanel() {
    aiAbortRef.current?.abort();
    aiAbortRef.current = null;
    setAiState(null);
  }

  async function runAction(kind: AIResult["kind"]) {
    if (!selected) return;
    aiAbortRef.current?.abort();
    const ctrl = new AbortController();
    aiAbortRef.current = ctrl;

    setAiState({ phase: "loading", kind });
    setCopied(false);

    try {
      const result = await runAI({
        kind,
        content: `${selected.title}\n\n${selected.content}`.trim(),
        signal: ctrl.signal,
        onChunk: (text) => {
          setAiState({ phase: "streaming", kind, text });
        },
      });
      if (ctrl.signal.aborted) return;
      setAiState({ phase: "done", result });
    } catch {
      // aborted — fine
    }
  }

  function applyResult() {
    if (aiState?.phase !== "done" || !selected) return;
    const { kind, content } = aiState.result;
    if (kind === "title") {
      updateSelected({ title: content });
    } else if (kind === "tags") {
      const tags = content
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      updateSelected({ tags });
    } else if (kind === "improve" || kind === "expand") {
      const body = content.includes("\n\n")
        ? content.split("\n\n").slice(1).join("\n\n").trim()
        : content;
      updateSelected({ content: body });
    } else if (kind === "summary") {
      const callout = `> Summary: ${content}\n\n`;
      updateSelected({ content: callout + selected.content });
    }
    setAiState(null);
  }

  function copyResult() {
    if (aiState?.phase !== "done") return;
    void navigator.clipboard.writeText(aiState.result.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  useEffect(() => {
    return () => {
      aiAbortRef.current?.abort();
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  return (
    <div className="app-shell">
      <Sidebar
        notes={notes}
        selectedId={selectedId}
        onSelect={(id) => {
          setSelectedId(id);
          setAiState(null);
        }}
        onNew={createNote}
      />

      <main className="main">
        {selected ? (
          <>
            <header className="main-header">
              <div className="crumb">
                <FolderIcon style={{ width: 14, height: 14 }} />
                <span>{FOLDER_LABEL[selected.folder]}</span>
                <span style={{ color: "var(--ink-300)" }}>/</span>
                <strong>{selected.title || "Untitled"}</strong>
              </div>
              <span className={`save-pill${saving ? " saving" : ""}`}>
                <span className="dot" />
                {saving ? "Saving…" : "Saved"}
              </span>
            </header>

            <div className={`editor-shell${aiState ? " has-panel" : ""}`}>
              <section className="editor">
                <div className="editor-inner">
                  <AIToolbar
                    active={
                      aiState && aiState.phase !== "done"
                        ? aiState.kind
                        : aiState?.phase === "done"
                        ? aiState.result.kind
                        : null
                    }
                    disabled={!selected || aiState?.phase === "loading"}
                    onRun={runAction}
                  />

                  <input
                    className="editor-title"
                    placeholder="Untitled"
                    value={selected.title}
                    onChange={(e) => updateSelected({ title: e.target.value })}
                  />

                  <div className="editor-meta-row">
                    <span className="editor-meta-item">
                      <FileTextIcon /> {selected.content.length} chars
                    </span>
                    <span className="editor-meta-item">
                      <FolderIcon /> {FOLDER_LABEL[selected.folder]}
                    </span>
                    {selected.tags.length > 0 && (
                      <span
                        style={{
                          display: "inline-flex",
                          gap: 4,
                          alignItems: "center",
                        }}
                      >
                        <TagIcon
                          style={{
                            width: 13,
                            height: 13,
                            color: "var(--ink-500)",
                          }}
                        />
                        {selected.tags.map((t) => (
                          <span key={t} className="tag-chip">
                            {t}
                          </span>
                        ))}
                      </span>
                    )}
                  </div>

                  {isEditing ? (
                    <textarea
                      ref={textareaRef}
                      className="editor-content-edit"
                      placeholder="Start writing… markdown supported (**bold**, *italic*, # heading, > quote, - list)."
                      value={selected.content}
                      onChange={(e) =>
                        updateSelected({ content: e.target.value })
                      }
                      onBlur={() => setIsEditing(false)}
                      rows={16}
                    />
                  ) : (
                    <div
                      className="editor-content-view"
                      onClick={() => setIsEditing(true)}
                      role="textbox"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setIsEditing(true);
                        }
                      }}
                    >
                      {selected.content ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {selected.content}
                        </ReactMarkdown>
                      ) : (
                        <span className="placeholder">
                          Start writing… or pick an AI action above. Markdown supported.
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </section>

              {aiState && (
                <AIPanel
                  state={aiState}
                  onClose={closePanel}
                  onApply={applyResult}
                  onCopy={copyResult}
                  applyLabel={
                    aiState.phase === "done"
                      ? aiState.result.kind === "title"
                        ? "Use as title"
                        : aiState.result.kind === "tags"
                        ? "Add tags"
                        : aiState.result.kind === "summary"
                        ? "Insert as callout"
                        : "Replace content"
                      : "Apply"
                  }
                  copied={copied}
                />
              )}
            </div>
          </>
        ) : (
          <div className="empty-state">
            <span className="empty-glyph">
              <SparkleIcon />
            </span>
            <h2 className="empty-title">Pick a note or start a new one</h2>
            <p className="empty-sub">
              Mira pairs your notes with quick AI assists — summarise, improve,
              tag, expand. Try one on any note in the sidebar.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
