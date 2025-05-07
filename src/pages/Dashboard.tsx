import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Cloud } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ProcessedTransaction, RiskDistData, ApiError } from "@/types/transaction";
import FileUpload from "@/components/dashboard/FileUpload";
import RiskDistributionChart from "@/components/dashboard/RiskDistributionChart";
import RiskTables from "@/components/dashboard/RiskTables";
import AllTransactionsTable from "@/components/dashboard/AllTransactionsTable";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  processTransactions, 
  calculateRiskDistribution, 
  createProbabilityTrendData,
  getTopTransactionsByRiskLevel,
  generateMockTransactions
} from "@/services/transactionService";

const Dashboard = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [apiError, setApiError] = useState<ApiError | undefined>(undefined);
  const [isDemoData, setIsDemoData] = useState(false);
  
  // State for storing data
  const [transactions, setTransactions] = useState<ProcessedTransaction[]>([]);
  const [riskDistributionData, setRiskDistributionData] = useState<RiskDistData[]>([]);
  const [probabilityTrendData, setProbabilityTrendData] = useState<{id: number, value: number}[]>([]);
  
  // States for storing top transactions by risk level
  const [topHighRisk, setTopHighRisk] = useState<ProcessedTransaction[]>([]);
  const [topMediumRisk, setTopMediumRisk] = useState<ProcessedTransaction[]>([]);
  const [topLowRisk, setTopLowRisk] = useState<ProcessedTransaction[]>([]);
  const [originalFileName, setOriginalFileName] = useState<string>("");

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setOriginalFileName(selectedFile.name);
    console.log("Selected file:", selectedFile.name);
    // Clear any previous errors when a new file is selected
    setApiError(undefined);
    // Set isDemoData to false when a new file is selected
    setIsDemoData(false);
  };

  // Function to process the uploaded file
  const processFile = useCallback(async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file first.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setApiError(undefined);

    try {
      console.log(`Processing file ${originalFileName || file.name}`);
      
      // Send the file to the Flask backend via our service
      const result = await processTransactions(file);
      
      // Check for API error
      if (result.error) {
        setIsProcessing(false);
        setApiError(result.error);
        
        // Changed variant from "warning" to "default" since "warning" is not an allowed variant
        toast({
          title: "Processing Warning",
          description: result.error.message,
          variant: "default",
        });
        
        // If we have some transactions despite the error, let's use them
        if (result.processedTransactions && result.processedTransactions.length > 0) {
          console.log(`Using ${result.processedTransactions.length} transactions despite errors`);
          const processedTransactions = result.processedTransactions;
          
          // Set all processed transactions
          setTransactions(processedTransactions);
          
          // Calculate risk distribution
          const riskDistData = calculateRiskDistribution(processedTransactions);
          setRiskDistributionData(riskDistData);
          
          // Create probability trend data
          const probTrend = createProbabilityTrendData(processedTransactions);
          setProbabilityTrendData(probTrend);
          
          // Get top 5 transactions by risk level
          const highRiskTxs = getTopTransactionsByRiskLevel(processedTransactions, "High");
          const mediumRiskTxs = getTopTransactionsByRiskLevel(processedTransactions, "Medium");
          const lowRiskTxs = getTopTransactionsByRiskLevel(processedTransactions, "Low");
          
          setTopHighRisk(highRiskTxs);
          setTopMediumRisk(mediumRiskTxs);
          setTopLowRisk(lowRiskTxs);
          
          // Show results even with errors
          setShowResults(true);
          setIsProcessing(false);
          
          toast({
            title: "Data loaded with warnings",
            description: `Showing ${processedTransactions.length} transactions from ${originalFileName || file.name} with simulated risk scores.`,
          });
        }
        return;
      }
      
      const processedTransactions = result.processedTransactions;
      
      // If no transactions were successfully processed, show error and return
      if (processedTransactions.length === 0) {
        setIsProcessing(false);
        toast({
          title: "Processing Failed",
          description: "No transactions could be processed. Please check your CSV format.",
          variant: "destructive",
        });
        return;
      }
      
      // Set all processed transactions
      setTransactions(processedTransactions);
      
      // Calculate risk distribution
      const riskDistData = calculateRiskDistribution(processedTransactions);
      setRiskDistributionData(riskDistData);
      
      // Create probability trend data
      const probTrend = createProbabilityTrendData(processedTransactions);
      setProbabilityTrendData(probTrend);
      
      // Get top 5 transactions by risk level
      const highRiskTxs = getTopTransactionsByRiskLevel(processedTransactions, "High");
      const mediumRiskTxs = getTopTransactionsByRiskLevel(processedTransactions, "Medium");
      const lowRiskTxs = getTopTransactionsByRiskLevel(processedTransactions, "Low");
      
      setTopHighRisk(highRiskTxs);
      setTopMediumRisk(mediumRiskTxs);
      setTopLowRisk(lowRiskTxs);
      
      // Show results
      setShowResults(true);
      setIsProcessing(false);
      
      toast({
        title: "Transaction analysis complete!",
        description: `Successfully analyzed ${processedTransactions.length} transactions from ${originalFileName || file.name}.`,
      });
    } catch (error) {
      console.error("Error processing file:", error);
      setIsProcessing(false);
      
      // Set API error for display
      setApiError({
        message: `Error processing file: ${error.message}. Please try again or check your CSV format.`,
      });
      
      toast({
        title: "Error processing file",
        description: "There was an error processing your file. Check your CSV format or try the demo data option.",
        variant: "destructive",
      });
    }
  }, [file, toast, originalFileName]);

  const useDemoData = () => {
    setIsProcessing(true);
    setIsDemoData(true);
    
    // Generate mock transactions for demo purposes
    setTimeout(() => {
      const mockTransactions = generateMockTransactions(50);
      
      setTransactions(mockTransactions);
      
      // Calculate risk distribution
      const riskDistData = calculateRiskDistribution(mockTransactions);
      setRiskDistributionData(riskDistData);
      
      // Create probability trend data
      const probTrend = createProbabilityTrendData(mockTransactions);
      setProbabilityTrendData(probTrend);
      
      // Get top 5 transactions by risk level
      const highRiskTxs = getTopTransactionsByRiskLevel(mockTransactions, "High");
      const mediumRiskTxs = getTopTransactionsByRiskLevel(mockTransactions, "Medium");
      const lowRiskTxs = getTopTransactionsByRiskLevel(mockTransactions, "Low");
      
      setTopHighRisk(highRiskTxs);
      setTopMediumRisk(mediumRiskTxs);
      setTopLowRisk(lowRiskTxs);
      
      // Show results
      setShowResults(true);
      setIsProcessing(false);
      
      toast({
        title: "Demo data loaded",
        description: "Using sample data for demonstration purposes.",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-blue-50">
      <header className="bg-white border-b border-gray-200 shadow-sm py-4">
        <div className="container mx-auto px-4 md:px-6 flex items-center">
          <Link to="/" className="flex items-center text-blue-700 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>Back to Home</span>
          </Link>
          <h1 className="text-xl font-semibold text-blue-700 mx-auto">
            Fraud Detection Dashboard
          </h1>
        </div>
      </header>
      
      <main className="flex-1 p-6">
        <div className="container mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            {!showResults ? (
              <>
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Fraud Detection Dashboard</h2>
                
                <p className="text-gray-700 mb-8">
                  Welcome to the fraud detection dashboard. Upload a transaction CSV file to analyze it for potential fraud.
                </p>
                
                {/* File Upload Section */}
                <FileUpload 
                  isProcessing={isProcessing}
                  onFileSelect={handleFileSelect}
                  onProcessFile={processFile}
                  error={apiError}
                  isDemoData={isDemoData}
                />

                {/* Demo Data Section - Always visible */}
                <div className="mt-6">
                  <h3 className="text-gray-700 mb-2">No backend? Try using demo data instead:</h3>
                  <Button 
                    onClick={useDemoData} 
                    variant="outline"
                    className="border-gray-300"
                    disabled={isProcessing}
                  >
                    Use Demo Data
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {isDemoData ? "Demo Data - " : ""}
                    Fraud Detection Dashboard
                  </h2>
                  <Button 
                    onClick={() => {
                      setShowResults(false);
                      setFile(null);
                      setApiError(undefined);
                      setIsDemoData(false);
                    }}
                    variant="outline"
                  >
                    Upload New File
                  </Button>
                </div>
                
                <p className="text-gray-700 mb-8">
                  Analysis complete. Review the risk distribution and transaction details below.
                  {isDemoData && " (Using demo data for demonstration purposes)"}
                </p>
                
                {isDemoData && (
                  <Alert className="mb-6 border-blue-300 bg-blue-50 text-blue-800">
                    <Cloud className="h-4 w-4 text-blue-600 mr-2" />
                    <AlertTitle className="text-blue-600">Demo Data Mode</AlertTitle>
                    <AlertDescription className="text-blue-700">
                      You are viewing randomly generated transaction data for demonstration purposes. To analyze real transactions, click "Upload New File" and select your CSV file.
                    </AlertDescription>
                  </Alert>
                )}
                
                {/* Dashboard Content with Risk Distribution Chart Only */}
                <div className="flex flex-col gap-8 mb-8">
                  {/* Risk Distribution Chart */}
                  <RiskDistributionChart data={riskDistributionData} />

                  {/* Top 5 Transactions Tables */}
                  <RiskTables 
                    highRiskTransactions={topHighRisk}
                    mediumRiskTransactions={topMediumRisk}
                    lowRiskTransactions={topLowRisk}
                  />

                  {/* All Transactions Table */}
                  <AllTransactionsTable transactions={transactions} />
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
