import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = {
  commute:     '#ef4444',
  food:        '#f97316',
  electricity: '#eab308',
  purchases:   '#8b5cf6',
};

export default function BreakdownChart({ breakdown }) {
  const data = Object.entries(breakdown)
    .filter(([, value]) => value > 0)
    .map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: parseFloat(value.toFixed(3)),
    }));

  if (data.length === 0) return null;

  return (
    <div className="chart-wrapper">
      <PieChart width={300} height={300}>
        <Pie
          data={data}
          cx={150}
          cy={140}
          innerRadius={70}
          outerRadius={110}
          dataKey="value"
        >
          {data.map((entry) => (
            <Cell
              key={entry.name}
              fill={COLORS[entry.name.toLowerCase()] ?? '#22c55e'}
            />
          ))}
        </Pie>
        <Tooltip formatter={(val) => `${val} kg CO₂`} />
        <Legend />
      </PieChart>
    </div>
  );
}