import { useEffect, useState } from "react";

const STORAGE_KEY = "apex_tasks";

const emptyTask = {
  title: "",
  owner: "",
  priority: "Medium",
  status: "Open",
  deadline: "",
  relatedDeal: "",
};

export default function TaskManager({
  deals = [],
}) {
  const [tasks, setTasks] =
    useState(() => {
      const saved =
        localStorage.getItem(
          STORAGE_KEY
        );

      return saved
        ? JSON.parse(saved)
        : [];
    });

  const [form, setForm] =
    useState(emptyTask);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(tasks)
    );
  }, [tasks]);

  function updateForm(
    key,
    value
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  function addTask() {
    if (!form.title.trim())
      return;

    const task = {
      id: Date.now(),
      ...form,
    };

    setTasks((prev) => [
      task,
      ...prev,
    ]);

    setForm(emptyTask);
  }

  function removeTask(id) {
    setTasks((prev) =>
      prev.filter(
        (t) => t.id !== id
      )
    );
  }

  function toggleStatus(id) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status:
                t.status ===
                "Done"
                  ? "Open"
                  : "Done",
            }
          : t
      )
    );
  }

  const openTasks =
    tasks.filter(
      (t) => t.status === "Open"
    ).length;

  const completedTasks =
    tasks.filter(
      (t) => t.status === "Done"
    ).length;

  const highPriority =
    tasks.filter(
      (t) =>
        t.priority === "High"
    ).length;

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">
            TASK{" "}
            <span>MANAGER</span>
          </div>

          <div className="page-sub">
            Deal Execution &
            Ownership Workflow
          </div>
        </div>
      </div>

      <div
        className="dashboard-grid"
        style={{
          marginBottom: 20,
        }}
      >
        <Metric
          label="Open Tasks"
          value={openTasks}
        />

        <Metric
          label="Completed"
          value={
            completedTasks
          }
        />

        <Metric
          label="High Priority"
          value={highPriority}
        />

        <Metric
          label="Total Tasks"
          value={tasks.length}
        />
      </div>

      <div
        className="card"
        style={{
          marginBottom: 20,
        }}
      >
        <div className="card-title">
          Neue Aufgabe
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(160px,1fr))",
            gap: 12,
          }}
        >
          <input
            className="input"
            placeholder="Task"
            value={form.title}
            onChange={(e) =>
              updateForm(
                "title",
                e.target.value
              )
            }
          />

          <input
            className="input"
            placeholder="Owner"
            value={form.owner}
            onChange={(e) =>
              updateForm(
                "owner",
                e.target.value
              )
            }
          />

          <input
            className="input"
            type="date"
            value={form.deadline}
            onChange={(e) =>
              updateForm(
                "deadline",
                e.target.value
              )
            }
          />

          <select
            className="input"
            value={form.priority}
            onChange={(e) =>
              updateForm(
                "priority",
                e.target.value
              )
            }
          >
            <option>
              High
            </option>

            <option>
              Medium
            </option>

            <option>
              Low
            </option>
          </select>

          <select
            className="input"
            value={
              form.relatedDeal
            }
            onChange={(e) =>
              updateForm(
                "relatedDeal",
                e.target.value
              )
            }
          >
            <option value="">
              Deal auswählen
            </option>

            {deals.map(
              (deal) => (
                <option
                  key={deal.id}
                  value={deal.name}
                >
                  {deal.name}
                </option>
              )
            )}
          </select>

          <button
            className="btn btn-primary"
            onClick={addTask}
          >
            TASK ERSTELLEN
          </button>
        </div>
      </div>

      <div className="market-grid">
        {tasks.map((task) => {
          const priorityColor =
            task.priority ===
            "High"
              ? "var(--red)"
              : task.priority ===
                "Medium"
              ? "var(--orange)"
              : "var(--accent)";

          return (
            <div
              className="market-card"
              key={task.id}
            >
              <div className="market-card-name">
                {task.title}
              </div>

              <div
                className="muted"
                style={{
                  marginBottom: 12,
                }}
              >
                {task.relatedDeal ||
                  "General"}
              </div>

              <div
                style={{
                  display: "grid",
                  gap: 8,
                  marginBottom: 14,
                }}
              >
                <div>
                  Owner:{" "}
                  {task.owner ||
                    "-"}
                </div>

                <div>
                  Deadline:{" "}
                  {task.deadline ||
                    "-"}
                </div>

                <div
                  style={{
                    color:
                      priorityColor,
                  }}
                >
                  Priority:{" "}
                  {
                    task.priority
                  }
                </div>

                <div>
                  Status:{" "}
                  {task.status}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 8,
                }}
              >
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() =>
                    toggleStatus(
                      task.id
                    )
                  }
                >
                  {task.status ===
                  "Done"
                    ? "REOPEN"
                    : "DONE"}
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() =>
                    removeTask(
                      task.id
                    )
                  }
                >
                  DELETE
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Metric({
  label,
  value,
}) {
  return (
    <div className="metric-card">
      <div className="metric-label">
        {label}
      </div>

      <div className="metric-value">
        {value}
      </div>
    </div>
  );
}