export default function StatusBadge({ status }) {
  const map = {
    Approved: "badge badge-green",
    Active: "badge badge-green",
    Completed: "badge badge-green",

    Pending: "badge badge-yellow",
    Review: "badge badge-yellow",

    Rejected: "badge badge-red",
    Suspended: "badge badge-red",

    Info: "badge badge-blue"
  };

  return <span className={map[status] || "badge"}>{status}</span>;
}