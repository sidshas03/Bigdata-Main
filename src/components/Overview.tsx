
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Zap, BarChart3 } from "lucide-react";

const Overview = () => {
  return (
    <section id="overview" className="py-24 px-4 relative">
      <div className="container mx-auto relative z-10">
        <h2 className="text-3xl md:text-5xl font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500 text-center">
          Intelligent Fraud Protection
        </h2>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur-sm opacity-30"></div>
              <Card className="border-0 glass-effect relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6 text-blue-400 flex items-center">
                    <AlertTriangle className="h-6 w-6 mr-2" />
                    The Challenge
                  </h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Financial fraud costs businesses billions annually, with techniques becoming increasingly sophisticated. 
                    Traditional rule-based systems struggle to adapt quickly, creating security gaps that put both 
                    businesses and consumers at risk.
                  </p>
                  <div className="mt-8 p-4 bg-blue-500/5 border border-blue-500/10 rounded-lg">
                    <p className="text-blue-300 text-sm">
                      <strong className="text-blue-400">Critical Impact:</strong> Credit card fraud alone resulted in over $28 billion in global losses last year
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur-sm opacity-30"></div>
              <Card className="border-0 glass-effect relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6 text-blue-400 flex items-center">
                    <Zap className="h-6 w-6 mr-2" />
                    Our Solution
                  </h3>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Our fraud detection system leverages cutting-edge machine learning algorithms that analyze transaction 
                    patterns in real-time. The system adapts continuously to new fraud techniques while handling massive 
                    volumes of transactions through our scalable architecture.
                  </p>
                  <div className="mt-8 p-4 bg-blue-500/5 border border-blue-500/10 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Detection Accuracy</span>
                      <span className="text-blue-400 font-medium">99.2%</span>
                    </div>
                    <div className="w-full h-2 bg-blue-500/10 rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full" style={{width: "99.2%"}}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        <div className="mt-20 relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur-sm opacity-30"></div>
          <Card className="border-0 glass-effect">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-blue-400 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 mr-2" />
                Key Performance Metrics
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="p-4 border border-blue-500/20 rounded-lg bg-blue-500/5">
                  <h4 className="text-gray-400 text-sm mb-1">False Positive Rate</h4>
                  <p className="text-3xl font-bold text-white">0.3%</p>
                </div>
                
                <div className="p-4 border border-blue-500/20 rounded-lg bg-blue-500/5">
                  <h4 className="text-gray-400 text-sm mb-1">Processing Speed</h4>
                  <p className="text-3xl font-bold text-white">5ms</p>
                </div>
                
                <div className="p-4 border border-blue-500/20 rounded-lg bg-blue-500/5">
                  <h4 className="text-gray-400 text-sm mb-1">Detection Rate</h4>
                  <p className="text-3xl font-bold text-white">99.7%</p>
                </div>
                
                <div className="p-4 border border-blue-500/20 rounded-lg bg-blue-500/5">
                  <h4 className="text-gray-400 text-sm mb-1">Daily Volume</h4>
                  <p className="text-3xl font-bold text-white">10M+</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Overview;
