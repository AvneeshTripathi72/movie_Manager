const StatCard = ({ label, value, helper }) => {
  return (
    <div className="stat-card">
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
      {helper && <p className="stat-helper">{helper}</p>}
    </div>
  );
};

export default StatCard;
