
import { Card, CardContent } from "@/components/ui/card";
import { DatabaseBackup, ChartLine, FileText, Database, Rocket } from "lucide-react";

const features = [
  {
    icon: DatabaseBackup,
    title: "Data Cleaning & Preprocessing",
    description: "Advanced data cleaning pipelines that handle missing values, outliers, and ensure data quality for optimal model performance."
  },
  {
    icon: ChartLine,
    title: "ML Modeling",
    description: "Ensemble of machine learning algorithms including Random Forest, XGBoost, and neural networks to identify complex fraud patterns."
  },
  {
    icon: FileText,
    title: "Risk Classification",
    description: "Multi-level risk scoring system that categorizes transactions based on confidence levels and suspicious activity indicators."
  },
  {
    icon: Database,
    title: "Real-time Monitoring",
    description: "Continuous transaction monitoring with millisecond response times to detect and prevent fraudulent activities as they occur."
  },
  {
    icon: Rocket,
    title: "Big Data Scalability",
    description: "Built on distributed computing architecture to handle millions of transactions daily without performance degradation."
  }
];

const Features = () => {
  return (
    <section id="features" className="py-16 px-4 bg-blue-50">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center text-gray-800">
          Key Features
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Our system combines cutting-edge technology with practical solutions to protect businesses and customers.
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="bg-blue-100 p-3 rounded-full mb-5">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
