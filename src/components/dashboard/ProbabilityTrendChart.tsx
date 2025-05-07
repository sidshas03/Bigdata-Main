
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";

interface ProbabilityTrendChartProps {
  data: {id: number, value: number}[];
}

const ProbabilityTrendChart = ({ data }: ProbabilityTrendChartProps) => {
  return (
    <Card className="p-4 border border-gray-200">
      <CardContent className="p-0">
        <h3 className="text-lg font-medium mb-4 text-gray-800">📈 Fraud Probability Trend</h3>
        <div className="h-80">
          <ChartContainer config={{}} className="h-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="id" />
                <YAxis domain={[0, 1]} />
                <ChartTooltip />
                <Line type="monotone" dataKey="value" stroke="#3B82F6" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProbabilityTrendChart;
