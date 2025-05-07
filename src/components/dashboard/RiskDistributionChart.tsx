
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { RiskDistData } from "@/types/transaction";

interface RiskDistributionChartProps {
  data: RiskDistData[];
}

const RiskDistributionChart = ({ data }: RiskDistributionChartProps) => {
  // Function to determine bar color based on risk level
  const getBarColor = (name: string) => {
    switch (name) {
      case 'High Risk':
        return '#ef4444'; // Red
      case 'Medium Risk':
        return '#f59e0b'; // Yellow/Amber
      case 'Low Risk':
        return '#10b981'; // Green
      default:
        return '#3B82F6'; // Default blue
    }
  };

  return (
    <Card className="p-4 border border-gray-200 shadow-sm bg-white">
      <CardContent className="p-0">
        <h3 className="text-lg font-medium mb-4 text-gray-800">Risk Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={true}
                tickLine={true}
                tick={{ fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                axisLine={true}
                tickLine={true}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value: number) => [`${value} transactions`, 'Count']}
                labelFormatter={(label) => `${label}`}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.375rem',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                }}
              />
              <Bar 
                dataKey="value" 
                name="Transactions"
                fill="#3B82F6"
                radius={4} // Fixed: Changed from [4, 4, 0, 0] to single number 4
                fillOpacity={0.9}
                shape={(props: any) => {
                  const { x, y, width, height } = props;
                  return (
                    <rect 
                      x={x} 
                      y={y} 
                      width={width} 
                      height={height} 
                      fill={getBarColor(props.payload.name)} 
                      rx={4} // Using rx for horizontal radius instead of radius prop
                      ry={4} // Using ry for vertical radius
                    />
                  );
                }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskDistributionChart;
