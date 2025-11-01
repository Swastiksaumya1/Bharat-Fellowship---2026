import React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

// Helper function to safely extract numeric values
const extractNumber = (value) => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const num = parseFloat(value.replace(/,/g, ''));
    return isNaN(num) ? 0 : num;
  }
  return 0;
};

// Helper to format large numbers
const formatNumber = (num) => {
  if (num >= 10000000) return (num / 10000000).toFixed(2) + ' Cr';
  if (num >= 100000) return (num / 100000).toFixed(2) + ' L';
  if (num >= 1000) return (num / 1000).toFixed(2) + ' K';
  return num.toFixed(0);
};

export default function Stats({ data, district, state }) {
  // Handle empty or invalid data
  if (!data || typeof data !== 'object') {
    return (
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">No Data Available</h2>
        <p className="text-gray-600">
          No MGNREGA data found for {district}, {state}. This could mean:
        </p>
        <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
          <li>The API resource ID is incorrect</li>
          <li>No data exists for this district</li>
          <li>The API is temporarily unavailable</li>
        </ul>
      </div>
    );
  }

  // Extract records from API response
  const records = data.records || [];
  
  if (records.length === 0) {
    return (
      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Summary for {district}, {state}</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            ⚠️ No records found in the API response. The data structure might be different than expected.
          </p>
        </div>
        
        {/* Show raw data for debugging */}
        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
            View raw API response
          </summary>
          <pre className="mt-2 text-xs text-gray-700 bg-gray-50 p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(data, null, 2)}
          </pre>
        </details>
      </div>
    );
  }

  // Calculate summary statistics from records
  const totalRecords = records.length;
  
  // Try to extract common MGNREGA metrics
  const calculateMetrics = () => {
    let totalWorkers = 0;
    let totalWages = 0;
    let totalProjects = 0;
    let totalWorkDays = 0;

    records.forEach(record => {
      // Common field names in MGNREGA datasets
      totalWorkers += extractNumber(record.total_workers || record.workers || record.households || 0);
      totalWages += extractNumber(record.total_wages || record.wages_paid || record.expenditure || 0);
      totalProjects += extractNumber(record.total_projects || record.projects || record.works || 0);
      totalWorkDays += extractNumber(record.persondays || record.work_days || record.mandays || 0);
    });

    return { totalWorkers, totalWages, totalProjects, totalWorkDays };
  };

  const metrics = calculateMetrics();

  // Prepare data for charts
  const chartData = records.slice(0, 10).map((record, index) => ({
    name: record.financial_year || record.month || record.block || `Entry ${index + 1}`,
    workers: extractNumber(record.total_workers || record.workers || 0),
    wages: extractNumber(record.total_wages || record.wages_paid || 0),
    projects: extractNumber(record.total_projects || record.projects || 0)
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="mt-6 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon="👥"
          title="Total Workers"
          value={formatNumber(metrics.totalWorkers)}
          color="bg-blue-500"
        />
        <MetricCard
          icon="💰"
          title="Total Wages"
          value={`₹${formatNumber(metrics.totalWages)}`}
          color="bg-green-500"
        />
        <MetricCard
          icon="🏗️"
          title="Total Projects"
          value={formatNumber(metrics.totalProjects)}
          color="bg-purple-500"
        />
        <MetricCard
          icon="📅"
          title="Work Days"
          value={formatNumber(metrics.totalWorkDays)}
          color="bg-orange-500"
        />
      </div>

      {/* District Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {district}, {state}
        </h2>
        <p className="text-gray-600 mt-1">
          Showing {totalRecords} record{totalRecords !== 1 ? 's' : ''} from MGNREGA database
        </p>
      </div>

      {/* Charts */}
      {chartData.length > 0 && (
        <>
          {/* Bar Chart - Workers by Period */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Workers Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip formatter={(value) => formatNumber(value)} />
                <Legend />
                <Bar dataKey="workers" fill="#3B82F6" name="Workers" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Line Chart - Wages Trend */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Wages Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip formatter={(value) => `₹${formatNumber(value)}`} />
                <Legend />
                <Line type="monotone" dataKey="wages" stroke="#10B981" strokeWidth={2} name="Wages (₹)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Detailed Records</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {Object.keys(records[0] || {}).slice(0, 6).map((key) => (
                  <th
                    key={key}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {key.replace(/_/g, ' ')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {records.slice(0, 10).map((record, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  {Object.values(record).slice(0, 6).map((value, vidx) => (
                    <td key={vidx} className="px-4 py-3 text-sm text-gray-900">
                      {String(value)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {records.length > 10 && (
          <p className="mt-4 text-sm text-gray-500 text-center">
            Showing 10 of {records.length} records
          </p>
        )}
      </div>

      {/* Raw Data (Collapsible) */}
      <details className="bg-white rounded-lg shadow p-6">
        <summary className="cursor-pointer text-lg font-semibold text-gray-800 hover:text-indigo-600">
          View Raw API Response
        </summary>
        <pre className="mt-4 text-xs text-gray-700 bg-gray-50 p-4 rounded overflow-auto max-h-96">
          {JSON.stringify(data, null, 2)}
        </pre>
      </details>
    </div>
  );
}

// Metric Card Component
function MetricCard({ icon, title, value, color }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`${color} text-white text-3xl p-3 rounded-full`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

