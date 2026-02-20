function StatsCards({ donations }) {

const total = donations.length;
const pending = donations.filter(d => d.status === "pending").length;
const approved = donations.filter(d => d.status === "approved").length;
const rejected = donations.filter(d => d.status === "rejected").length;

  return (
    <div className="stats-container">
      <div className="card">Total: {total}</div>
      <div className="card">Pending: {pending}</div>
      <div className="card">Approved: {approved}</div>
      <div className="card">Rejected: {rejected}</div>
    </div>
  );
}
export default StatsCards;