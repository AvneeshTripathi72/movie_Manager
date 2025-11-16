import { useEffect, useState } from 'react';
import ErrorState from '../components/ErrorState.jsx';
import Loader from '../components/Loader.jsx';
import Table from '../components/Table.jsx';
import { adminService } from '../services/adminService.js';
import { formatDate } from '../utils/formatDate.js';

const ActivityLogs = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [logs, setLogs] = useState([]);
  const [summary, setSummary] = useState(null);

  const loadLogs = async () => {
    setLoading(true);
    setError('');
    try {
      const [logsResponse, summaryResponse] = await Promise.all([
        adminService.getActivityLogs({ limit: 50 }),
        adminService.getActivitySummary(),
      ]);
      setLogs(logsResponse.data.data.activities);
      setSummary(summaryResponse.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load activity logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  if (loading) {
    return <Loader fullscreen />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <div className="grid">
      <section className="card">
        <div className="table-toolbar">
          <div>
            <h3>Activity Summary</h3>
            <p>{summary?.stats?.totalActivities ?? 0} total activities recorded.</p>
          </div>
          <button type="button" onClick={loadLogs}>
            Refresh
          </button>
        </div>
        <div className="summary-grid">
          <div className="summary-box">
            <h4>Users</h4>
            <p>{Object.keys(summary?.stats?.userActions || {}).length}</p>
          </div>
          <div className="summary-box">
            <h4>Actions</h4>
            <p>{Object.keys(summary?.stats?.actionTypes || {}).length}</p>
          </div>
        </div>
      </section>

      <section className="card">
        <h3>Recent Activity</h3>
        <Table
          columns={[
            { key: 'timestamp', header: 'Time' },
            { key: 'user', header: 'User' },
            { key: 'action', header: 'Action' },
            { key: 'method', header: 'Method' },
            { key: 'endpoint', header: 'Endpoint' },
          ]}
          rows={logs.map((log) => ({
            timestamp: formatDate(log.timestamp, 'MMM D, YYYY h:mm A'),
            user: log.userEmail || log.userId || 'Unknown',
            action: log.action || 'N/A',
            method: log.method,
            endpoint: log.endpoint,
          }))}
          emptyMessage="No recent activity to show."
        />
      </section>
    </div>
  );
};

export default ActivityLogs;
