const StatsCards = () => {
  return (
    <>
      <div className="cards-grid">
        <div className="card">
          <i className="fas fa-hand-holding-heart"></i>
          <h3>Total Donations</h3>
          <p>12</p>
        </div>

        <div className="card">
          <i className="fas fa-hourglass-half"></i>
          <h3>Pending</h3>
          <p>4</p>
        </div>

        <div className="card">
          <i className="fas fa-check-circle"></i>
          <h3>Completed</h3>
          <p>8</p>
        </div>
      </div>
    </>
  );
};

export default StatsCards;
