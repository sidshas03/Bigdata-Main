
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="py-12 px-4 bg-white">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4 text-blue-600">
            Credit Card Fraud Detection System
          </h1>
          
          <p className="text-xl text-gray-700 mb-8">
            Intelligent fraud protection powered by machine learning
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/dashboard">
              <Button className="bg-blue-600 hover:bg-blue-700 text-lg w-full sm:w-auto">
                Launch Fraud Detection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 text-lg w-full sm:w-auto">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
