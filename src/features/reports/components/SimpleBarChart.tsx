import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card } from "@/components/ui/card";

const data = [
  { month: "JAN", travel: 35, meals: 0 },
  { month: "FEB", travel: 0, meals: 20 },
  { month: "MAR", travel: 0, meals: 0 },
  { month: "APR", travel: 0, meals: 0 },
  { month: "MAY", travel: 0, meals: 0 },
  { month: "JUN", travel: 0, meals: 0 },
  { month: "JUL", travel: 0, meals: 0 },
  { month: "AUG", travel: 0, meals: 0 },
  { month: "SEP", travel: 0, meals: 0 },
  { month: "OCT", travel: 0, meals: 0 },
  { month: "NOV", travel: 0, meals: 0 },
  { month: "DEC", travel: 0, meals: 0 },
];

export const SimpleBarChart: React.FC = () => {
  return (
    <Card className="p-4 rounded-xl">
      <h3 className="text-sm font-semibold  pb-2 mb-4 border-b">Analytics</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: -20, right: 20, left: 0, bottom: 0 }}
          barGap={8}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={{ stroke: "#ccc" }}
            style={{ fontSize: 12 }}
          />
          <YAxis
            tickFormatter={(value) => `${value}%`}
            domain={[0, 100]}
            tickLine={false}
            axisLine={{ stroke: "#ccc" }}
            style={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value: number) => `${value}%`}
            labelStyle={{ fontSize: 12 }}
          />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            wrapperStyle={{ fontSize: 12 }}
          />
          <Bar
            dataKey="travel"
            fill="#8E94FF"
            name="Travel expanse"
            radius={[4, 4, 0, 0]}
            barSize={18}
          />
          <Bar
            dataKey="meals"
            fill="#16B816"
            name="Meals"
            radius={[4, 4, 0, 0]}
            barSize={18}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};
