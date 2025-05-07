
import { Card, CardContent } from "@/components/ui/card";
import TransactionTable from "./TransactionTable";
import { ProcessedTransaction } from "@/types/transaction";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartLegendContent } from "@/components/ui/chart";
import { useState } from "react";

interface RiskTablesProps {
  highRiskTransactions: ProcessedTransaction[];
  mediumRiskTransactions: ProcessedTransaction[];
  lowRiskTransactions: ProcessedTransaction[];
}

const RiskTables = ({ 
  highRiskTransactions, 
  mediumRiskTransactions, 
  lowRiskTransactions 
}: RiskTablesProps) => {
  const [showChart, setShowChart] = useState(true);

  // Prepare data for the chart
  const prepareChartData = () => {
    const chartData = [];
    
    // Process high risk transactions
    highRiskTransactions.slice(0, 5).forEach((tx, index) => {
      chartData.push({
        name: `H${index + 1}`,
        probability: tx.fraud_probability * 100,
        riskLevel: 'High',
        id: tx.id || `high-${index}`
      });
    });
    
    // Process medium risk transactions
    mediumRiskTransactions.slice(0, 5).forEach((tx, index) => {
      chartData.push({
        name: `M${index + 1}`,
        probability: tx.fraud_probability * 100,
        riskLevel: 'Medium',
        id: tx.id || `medium-${index}`
      });
    });
    
    // Process low risk transactions
    lowRiskTransactions.slice(0, 5).forEach((tx, index) => {
      chartData.push({
        name: `L${index + 1}`,
        probability: tx.fraud_probability * 100,
        riskLevel: 'Low',
        id: tx.id || `low-${index}`
      });
    });
    
    return chartData;
  };
  
  const chartData = prepareChartData();
  
  const chartConfig = {
    High: { color: "#ef4444" },   // Red for high risk
    Medium: { color: "#f59e0b" }, // Yellow for medium risk
    Low: { color: "#10b981" }     // Green for low risk
  };

  // Custom fill function for the bar chart based on risk level
  const getBarFill = (entry: any) => {
    return chartConfig[entry.riskLevel as keyof typeof chartConfig].color;
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Chart for Top 5 Risk Probabilities */}
      <Card className="p-4 border border-gray-200">
        <CardContent className="p-0">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800">
              📊 Top 5 Transactions Risk Probabilities
            </h3>
            <button 
              onClick={() => setShowChart(!showChart)} 
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {showChart ? 'Hide Chart' : 'Show Chart'}
            </button>
          </div>
          
          {showChart && (
            <div className="h-80">
              <ChartContainer config={chartConfig} className="h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'Probability (%)', angle: -90, position: 'insideLeft' }} />
                    <ChartTooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white p-2 border rounded shadow">
                              <p>Risk Level: <strong>{data.riskLevel}</strong></p>
                              <p>Probability: <strong>{data.probability.toFixed(2)}%</strong></p>
                              <p>Transaction: {data.id}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend content={<ChartLegendContent />} />
                    <Bar 
                      dataKey="probability" 
                      name="Risk Probability"
                      fillOpacity={0.8}
                      stroke="#000"
                      strokeWidth={1}
                      fill="#8884d8"
                      shape={(props) => {
                        const { x, y, width, height, payload } = props;
                        const fill = getBarFill(payload);
                        return (
                          <rect 
                            x={x} 
                            y={y} 
                            width={width} 
                            height={height} 
                            fill={fill} 
                            stroke="#000"
                            strokeWidth={1}
                            fillOpacity={0.8}
                          />
                        );
                      }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="p-4 border border-gray-200">
        <CardContent className="p-0">
          <TransactionTable 
            transactions={highRiskTransactions}
            title="Top 5 High Risk Transactions"
            titleColor="text-red-600"
            icon="🚨"
            rowClassName="bg-red-50"
          />
        </CardContent>
      </Card>

      <Card className="p-4 border border-gray-200">
        <CardContent className="p-0">
          <TransactionTable 
            transactions={mediumRiskTransactions}
            title="Top 5 Medium Risk Transactions"
            titleColor="text-yellow-600"
            icon="⚠️"
            rowClassName="bg-yellow-50"
          />
        </CardContent>
      </Card>

      <Card className="p-4 border border-gray-200">
        <CardContent className="p-0">
          <TransactionTable 
            transactions={lowRiskTransactions}
            title="Top 5 Low Risk Transactions"
            titleColor="text-green-600"
            icon="✅"
            rowClassName="bg-green-50"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskTables;
