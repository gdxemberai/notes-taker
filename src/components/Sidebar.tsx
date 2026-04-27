"use client";

import { useMemo, useState } from "react";
import type { Note, NoteFolder } from "@/lib/types";
import {
  CommandIcon,
  PlusIcon,
  SearchIcon,
  SparkleIcon,
} from "@/lib/icons";

interface Props {
  notes: Note[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
}

const FOLDERS: { id: NoteFolder | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "work", label: "Work" },
  { id: "personal", label: "Personal" },
  { id: "ideas", label: "Ideas" },
];

export function Sidebar({ notes, selectedId, onSelect, onNew }: Props) {
  const [folder, setFolder] = useState<NoteFolder | "all">("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return notes
      .filter((n) => folder === "all" || n.folder === folder)
      .filter((n) => {
        if (!query.trim()) return true;
        const q = query.toLowerCase();
        return (
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.tags.some((t) => t.toLowerCase().includes(q))
        );
      })
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
  }, [notes, folder, query]);

  return (
    <aside className="sidebar">
      <div className="sidebar-head">
        <div className="brand-row">
          <div className="brand-mark">
            <span className="brand-glyph">
              <SparkleIcon />
            </span>
            Mira
          </div>
          <span className="kbd-hint">
            <CommandIcon style={{ width: 11, height: 11 }} />K
          </span>
        </div>
        <div className="search-box">
          <SearchIcon />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes…"
          />
        </div>
      </div>

      <div className="folder-tabs">
        {FOLDERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`folder-tab${folder === f.id ? " active" : ""}`}
            onClick={() => setFolder(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="note-list">
        {filtered.length === 0 ? (
          <div className="note-list-empty">No notes match.</div>
        ) : (
          filtered.map((n) => (
            <button
              key={n.id}
              type="button"
              data-feedback-id={`note-card-${n.id}`}
              className={`note-item${selectedId === n.id ? " active" : ""}`}
              onClick={() => onSelect(n.id)}
            >
              <h3 className="note-item-title">{n.title || "Untitled"}</h3>
              <p className="note-item-preview">
                {firstLine(n.content) || "No content yet"}
              </p>
              <div className="note-item-meta">
                <span className="note-item-time">{formatTime(n.updatedAt)}</span>
                {n.tags.length > 0 && (
                  <span className="note-item-tags">
                    {n.tags.slice(0, 2).map((t) => (
                      <span key={t} className="note-item-tag">
                        {t}
                      </span>
                    ))}
                  </span>
                )}
              </div>
            </button>
          ))
        )}
      </div>

      <div className="sidebar-foot">
        <button
          type="button"
          className="btn btn-primary"
          onClick={onNew}
          data-feedback-id="new-note"
          style={{ width: "100%" }}
        >
          <PlusIcon className="btn-icon" />
          New note
        </button>
      </div>
    </aside>
  );
}

function firstLine(text: string): string {
  const stripped = text.replace(/\*\*/g, "").replace(/^#+\s*/gm, "");
  const line = stripped.split("\n").find((l) => l.trim().length > 0);
  return line ? (line.length > 90 ? line.slice(0, 87) + "…" : line) : "";
}

function formatTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
