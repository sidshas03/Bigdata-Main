
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="bg-white border-b border-gray-200 shadow-sm py-4">
        <div className="container mx-auto px-4 md:px-6 flex items-center">
          <Link to="/" className="flex items-center text-blue-700 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>Back to Home</span>
          </Link>
          <h1 className="text-xl font-semibold text-blue-700 mx-auto">
            About Our Team
          </h1>
        </div>
      </header>

      <main className="flex-1 p-6 bg-blue-50">
        <div className="container mx-auto">
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-8 text-center text-blue-700">Credit Card Fraud Detection System</h2>
            
            <div className="mb-10">
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">Project Overview</h3>
              <p className="text-gray-700 mb-4">
                This is our Big Data project for Spring 2025 CSGY-6513 course at NYU, taught by Mr. Amit Patel. 
                The project focuses on detecting fraudulent credit card transactions using advanced Machine Learning 
                models with Big Data scalability.
              </p>
            </div>
            
            <div className="mb-10">
              <h3 className="text-2xl font-semibold mb-6 text-gray-800">Our Team</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Team Member 1 */}
                <div className="flex flex-col items-center">
                  <div className="w-40 h-40 mb-4 rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
                    <img 
                      src="/uploads/sid.png" 
                      alt="Siddharthan P S"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-xl font-medium">Siddharthan P S</h4>
                  <p className="text-gray-600">MS in Computer Engineering</p>
                </div>
                
                {/* Team Member 2 */}
                <div className="flex flex-col items-center">
                  <div className="w-40 h-40 mb-4 rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
                    <img 
                      src="/uploads/trupt.png" 
                      alt="Trupt Acharya"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <h4 className="text-xl font-medium">Trupt Acharya</h4>
                  <p className="text-gray-600">MS in Computer Engineering</p>
                </div>
                
                {/* Team Member 3 */}
                <div className="flex flex-col items-center">
                  <div className="w-40 h-40 mb-4 rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
                    <img 
                      src="/uploads/tushar.png" 
                      alt="Tushar Dhanajay Pathak"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <h4 className="text-xl font-medium">Tushar Dhanajay Pathak</h4>
                  <p className="text-gray-600">MS in Computer Engineering</p>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">Course Information</h3>
              <p className="text-gray-700">
                <strong>Course:</strong> CSGY-6513 - Big Data<br />
                <strong>Semester:</strong> Spring 2025<br />
                <strong>Professor:</strong> Mr. Amit Patel<br />
                <strong>Institution:</strong> New York University
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
