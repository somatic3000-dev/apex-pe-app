// src/pages/TaskManager.jsx

import { useState } from "react";

const emptyTask = {
  title: "",
  owner: "",
  priority: "Medium",
  status: "Open",
  deadline: "",
  relatedDeal: "",
};

export default function TaskManager({ deals = [], tasks = [], setTasks }) {
  const [form, setForm] = useState(emptyTask);

  function updateForm(key, value) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function addTask() {
    if (!form.title.trim()) {
      alert("Bitte Task-Titel eintragen.");
      return;
    }

    const task = {
      id: Date.now(),
      title: form.title.trim(),
      owner: form.owner.trim(),
      priority: form.priority,
      status: "Open",
      deadline: form.deadline,
      relatedDeal: form.relatedDeal,
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [task, ...prev]);
    setForm(emptyTask);
  }

  function removeTask(id) {
    if (!confirm("Diese Aufgabe löschen?")) return;
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }

  function toggleStatus(id) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              status: task.status === "Done" ? "Open" : "Done",
            }
          : task
      )
    );
  }

  function isOverdue(task) {
    if (!task.deadline || task.status === "Done") return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deadline = new Date(task.deadline);
    deadline.setHours(0, 0, 0, 0);

    return deadline < today;
  }

  const openTasks = tasks.filter((task) => task.status !== "Done");
  const doneTasks = tasks.filter((task) => task.status === "Done");
  const highPriority = tasks.filter(
    (task) => task.priority === "High" && task.status !== "Done"
  );
  const overdueTasks = tasks.filter(isOverdue);

  const sortedTasks = [...tasks].sort((a, b) => {
    const priorityRank = { High: 3, Medium: 2, Low: 1 };
    const statusRank = { Open: 2, Done: 1 };

    return (
      (statusRank[b.status] || 0) - (statusRank[a.status] || 0) ||
      (priorityRank[b.priority] || 0) - (priorityRank[a.priority] || 0) ||
      String(a.deadline || "9999").localeCompare(String(b.deadline || "9999"))
    );
  });

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">
            TASK <span>MANAGER</span>
          </div>

          <div className="page-sub">
            Deal Execution · Ownership · Deadline Tracking
          </div>
        </div>
      </div>

      <div className="dashboard-grid" style={{ marginBottom: 20 }}>
        <Metric label="Open Tasks" value={openTasks.length} />
        <Metric label="Completed" value={doneTasks.length} />
        <Metric label="High Priority" value={highPriority.length} />
        <Metric label="Overdue" value={overdueTasks.length} />
        <Metric label="Total Tasks" value={tasks.length} />
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-title">Neue Aufgabe</div>

        <div className="market-grid">
          <input
            className="input"
            placeholder="Task"
            value={form.title}
            onChange={(event) => updateForm("title", event.target.value)}
          />

          <input
            className="input"
            placeholder="Owner"
            value={form.owner}
            onChange={(event) => updateForm("owner", event.target.value)}
          />

          <input
            className="input"
            type="date"
            value={form.deadline}
            onChange={(event) => updateForm("deadline", event.target.value)}
          />

          <select
            className="input"
            value={form.priority}
            onChange={(event) => updateForm("priority", event.target.value)}
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          <select
            className="input"
            value={form.relatedDeal}
            onChange={(event) => updateForm("relatedDeal", event.target.value)}
          >
            <option value="">Deal auswählen</option>

            {deals.map((deal) => (
              <option key={deal.id} value={deal.name}>
                {deal.name}
              </option>
            ))}
          </select>

          <button className="btn btn-primary" onClick={addTask}>
            TASK ERSTELLEN
          </button>
        </div>
      </div>

      <div className="market-grid">
        {sortedTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            overdue={isOverdue(task)}
            onToggle={() => toggleStatus(task.id)}
            onRemove={() => removeTask(task.id)}
          />
        ))}

        {tasks.length === 0 && (
          <div className="card">
            <div className="card-title">Keine Aufgaben</div>
            <p className="muted">
              Erstelle eine Aufgabe, um Deal Execution und Ownership zu tracken.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function TaskCard({ task, overdue, onToggle, onRemove }) {
  const priorityStyle = {
    High: "var(--red)",
    Medium: "var(--orange)",
    Low: "var(--accent)",
  };

  const statusColor =
    task.status === "Done"
      ? "var(--accent)"
      : overdue
      ? "var(--red)"
      : "var(--blue)";

  return (
    <div
      className="market-card"
      style={{
        borderLeft: `4px solid ${statusColor}`,
        opacity: task.status === "Done" ? 0.68 : 1,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
          alignItems: "flex-start",
          marginBottom: 10,
        }}
      >
        <div>
          <div className="market-card-name">{task.title}</div>

          <div className="muted" style={{ marginTop: 4 }}>
            {task.relatedDeal || "General"}
          </div>
        </div>

        <div
          style={{
            color: statusColor,
            fontSize: 12,
            fontWeight: 900,
          }}
        >
          {task.status === "Done" ? "DONE" : overdue ? "OVERDUE" : "OPEN"}
        </div>
      </div>

      <div style={{ display: "grid", gap: 8, marginBottom: 16 }}>
        <InfoRow label="Owner" value={task.owner || "-"} />
        <InfoRow label="Deadline" value={task.deadline || "-"} />

        <InfoRow
          label="Priority"
          value={task.priority}
          color={priorityStyle[task.priority] || "var(--muted)"}
        />
      </div>

      <div className="button-row">
        <button className="btn btn-ghost btn-sm" onClick={onToggle}>
          {task.status === "Done" ? "REOPEN" : "DONE"}
        </button>

        <button className="btn btn-danger btn-sm" onClick={onRemove}>
          DELETE
        </button>
      </div>
    </div>
  );
}

function InfoRow({ label, value, color }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <span className="muted">{label}</span>

      <strong style={{ color }}>{value}</strong>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="metric-card">
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
    </div>
  );
}