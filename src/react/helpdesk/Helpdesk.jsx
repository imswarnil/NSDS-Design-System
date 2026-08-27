import React from "react";
import { Field, Input, Select, Textarea } from "../forms/Form.jsx";
import { Status } from "../feedback/Feedback.jsx";

/* Namaste UI — helpdesk for the Next.js LMS.
   =========================================================================
   Support for a learning product. The console voice is native here — a
   ticket IS a record, so the mono id, status dot and terminal-row list are
   doing their real job. Styling lives in components/css/helpdesk.css; the
   Ghost side renders the same classes via ghost/partials/ns/ticket-form.hbs. */

const STATUS_TONE = { open: "idle", "in-progress": "info", waiting: "warning", resolved: "success", closed: "idle" };
const STATUS_LABEL = { open: "Open", "in-progress": "In progress", waiting: "Waiting on you", resolved: "Resolved", closed: "Closed" };

/** One status chip, so every surface spells ticket state identically. */
export function TicketStatus({ status }) {
  return <Status tone={STATUS_TONE[status] ?? "idle"}>{STATUS_LABEL[status] ?? status}</Status>;
}

/** The ticket list — real links, hairline rows, urgent gets the 3px edge. */
export function TicketList({ tickets = [], hrefFor = (t) => `/support/tickets/${t.id}`, emptyAction }) {
  if (!tickets.length) {
    return (
      <div className="ns-empty">
        <i className="ph ph-lifebuoy ns-empty__icon" aria-hidden="true" />
        <p className="ns-empty__title">No tickets yet</p>
        <p className="ns-empty__text">When you raise a support ticket it appears here with its status, so you never have to wonder whether we saw it.</p>
        {emptyAction && <div className="ns-empty__action">{emptyAction}</div>}
      </div>
    );
  }
  return (
    <div className="ns-tickets">
      {tickets.map((t) => (
        <a
          key={t.id}
          className={`ns-ticket ${t.priority === "urgent" ? "ns-ticket--urgent" : ""}`.trim()}
          href={hrefFor(t)}
        >
          <span className="ns-ticket__id">#{String(t.id).padStart(4, "0")}</span>
          <span className="ns-ticket__body">
            <span className="ns-ticket__subject">{t.subject}</span>
            {t.excerpt && <span className="ns-ticket__excerpt">{t.excerpt}</span>}
          </span>
          <TicketStatus status={t.status} />
          {/* A real <time>, so "2d ago" can carry the actual datetime. */}
          <time className="ns-ticket__when" dateTime={t.updatedAt}>{t.updatedLabel ?? t.updatedAt}</time>
        </a>
      ))}
    </div>
  );
}

/** The conversation on one ticket. Agent replies carry the brand edge,
 *  internal notes the warning edge — and both SAY what they are in the head
 *  row, because the edge color is reinforcement, not the message. */
export function TicketThread({ messages = [] }) {
  return (
    <div className="ns-thread">
      {messages.map((m, i) => (
        <article
          key={m.id ?? i}
          className={["ns-msg", m.role === "agent" && "ns-msg--agent", m.role === "note" && "ns-msg--note"].filter(Boolean).join(" ")}
        >
          <header className="ns-msg__head">
            <span>{m.author}</span>
            {m.role === "agent" && <span>· support</span>}
            {m.role === "note" && <span>· internal note</span>}
            <time dateTime={m.at}>{m.atLabel ?? m.at}</time>
          </header>
          <div className="ns-msg__body">{m.body}</div>
        </article>
      ))}
    </div>
  );
}

const DEFAULT_CATEGORIES = [
  { value: "course", label: "Course content — a lesson, video or quiz" },
  { value: "account", label: "Account & sign-in" },
  { value: "billing", label: "Billing & membership" },
  { value: "org", label: "My Salesforce practice org" },
  { value: "other", label: "Something else" },
];

const PRIORITIES = [
  { value: "low", label: "Low" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

/** Raise a ticket.
 *
 *  Priority is a styled radio FIELDSET, not buttons — arrow keys work
 *  natively and the group announces as one question. The urgent option is
 *  the only one allowed the error hue, and only once selected.
 *
 *  `context` pre-fills what the reporter should never have to type: the
 *  course/lesson they came from. Support tickets missing that context cost a
 *  round-trip every single time. */
export function TicketForm({ onSubmit, categories = DEFAULT_CATEGORIES, context, busy, error }) {
  const [subject, setSubject] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [priority, setPriority] = React.useState("normal");
  const [body, setBody] = React.useState("");
  const [file, setFile] = React.useState(null);

  return (
    <form
      className="ns-ticket-form"
      onSubmit={(e) => { e.preventDefault(); onSubmit?.({ subject, category, priority, body, file, context }); }}
    >
      {error && <p className="ns-field__error" role="alert">{error}</p>}

      {context && (
        <div className="ns-alert ns-alert--info" role="status">
          <i className="ph ph-info ns-alert__icon" aria-hidden="true" />
          <div className="ns-alert__body">
            <div className="ns-alert__text">This ticket will include: <strong>{context}</strong></div>
          </div>
        </div>
      )}

      <Field label="Subject" required help="One line — what went wrong, not the whole story.">
        <Input value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={120} />
      </Field>

      <Field label="Category" required>
        <Select placeholder="Choose a category" options={categories} value={category} onChange={(e) => setCategory(e.target.value)} required />
      </Field>

      <fieldset className="ns-fieldset">
        <legend className="ns-fieldset__legend">Priority</legend>
        <div className="ns-priority-row" role="radiogroup" aria-label="Priority">
          {PRIORITIES.map((p) => (
            <label key={p.value} className={`ns-priority ${p.value === "urgent" ? "ns-priority--urgent" : ""}`.trim()}>
              <input
                type="radio" name="priority" value={p.value}
                checked={priority === p.value}
                onChange={() => setPriority(p.value)}
              />
              <span>{p.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <Field label="What happened?" required help="What you did, what you expected, and what happened instead. Paste any error text verbatim.">
        <Textarea rows={6} value={body} onChange={(e) => setBody(e.target.value)} />
      </Field>

      {/* The label wraps the input, so clicking anywhere on the target opens
          the picker, and the chosen filename replaces the prompt. */}
      <label className="ns-attach">
        <i className={`ph ${file ? "ph-file" : "ph-paperclip"}`} aria-hidden="true" />
        {file ? file.name : "Attach a screenshot (optional)"}
        <input type="file" accept="image/*,.txt,.log" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      </label>

      <div>
        <button type="submit" className="ns-btn ns-btn--primary" data-loading={busy || undefined}>
          Raise ticket
        </button>
      </div>
    </form>
  );
}

/** The support landing: search plus the three routes. The ticket route comes
 *  LAST — the fastest resolution is the docs page that already answers it. */
export function HelpHub({ onSearch, cards }) {
  const defaults = [
    { icon: "ph-book-open", title: "Documentation", text: "Setup, courses, orgs — most answers live here.", href: "/docs" },
    { icon: "ph-chats-circle", title: "Common questions", text: "Billing, certificates, resetting your practice org.", href: "/support/faq" },
    { icon: "ph-lifebuoy", title: "Raise a ticket", text: "Can't find it? Tell us what broke and we'll take it from there.", href: "/support/new" },
  ];
  return (
    <div className="ns-stack">
      <form role="search" onSubmit={(e) => { e.preventDefault(); onSearch?.(new FormData(e.target).get("q")); }}>
        <Field label="Search help">
          <Input name="q" type="search" icon="ph-magnifying-glass" placeholder="Search docs and FAQs…" />
        </Field>
      </form>
      <div className="ns-grid">
        {(cards ?? defaults).map((c) => (
          <a className="ns-help-card" href={c.href} key={c.title}>
            <i className={`ph ${c.icon}`} aria-hidden="true" />
            <strong>{c.title}</strong>
            <p>{c.text}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
