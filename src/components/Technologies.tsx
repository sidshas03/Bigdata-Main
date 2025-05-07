
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const technologies = [
  {
    name: "Python",
    description: "Core programming language for data processing and model development",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg"
  },
  {
    name: "Scikit-learn",
    description: "Machine learning library for classification algorithms and data preprocessing",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/0/05/Scikit_learn_logo_small.svg"
  },
  {
    name: "Flask",
    description: "Lightweight web framework for API development and service integration",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3c/Flask_logo.svg"
  },
  {
    name: "Apache Spark",
    description: "Distributed data processing for large-scale transaction analysis and feature engineering",
    imageUrl: "https://spark.apache.org/images/spark-logo-trademark.png"
  },
  {
    name: "Streamlit",
    description: "Data visualization dashboard for real-time monitoring and analytics",
    imageUrl: "https://streamlit.io/images/brand/streamlit-mark-color.svg"
  }
];

const Technologies = () => {
  return (
    <section id="technologies" className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 cyber-grid pointer-events-none"></div>
      <div className="container mx-auto relative z-10">
        <h2 className="text-4xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
          Powered By Advanced Technologies
        </h2>
        <p className="text-center text-gray-300 mb-16 max-w-2xl mx-auto">
          Our fraud detection system integrates these powerful technologies to deliver a robust, scalable solution.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {technologies.map((tech, index) => (
            <div key={index} className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
              <Card className="relative glass-effect overflow-hidden hover:shadow-lg transition-all duration-300 h-full border-0">
                <div className="p-6 bg-gradient-to-b from-blue-900/20 to-transparent">
                  <div className="h-16 flex items-center justify-center mb-4">
                    <img 
                      src={tech.imageUrl} 
                      alt={tech.name} 
                      className="h-12 object-contain" 
                    />
                  </div>
                </div>
                <CardContent className="p-6">
                  <Badge variant="secondary" className="mb-3 bg-blue-900/30 text-blue-300 hover:bg-blue-900/40 border border-blue-500/30">
                    {tech.name}
                  </Badge>
                  <p className="text-sm text-gray-300">{tech.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Technologies;
