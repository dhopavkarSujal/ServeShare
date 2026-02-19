const StatsCards = ({ donations = [] }) => {

  const total = donations.length;
  const pending = donations.filter(d => d.status === "Pending").length;
  const completed = donations.filter(d => d.status === "Completed").length;

  return (
    <div className="cards-grid">
      <div className="card">
        <h3>Total Donations</h3>
        <p>{total}</p>
      </div>

      <div className="card">
        <h3>Pending</h3>
        <p>{pending}</p>
      </div>

      <div className="card">
        <h3>Completed</h3>
        <p>{completed}</p>
      </div>
    </div>
  );
};

export default StatsCards;
