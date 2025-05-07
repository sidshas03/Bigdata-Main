
import React, { useState, useRef, DragEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileCheck, AlertTriangle, Cloud, Database, FileType, Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ApiError } from "@/types/transaction";
import { Progress } from "@/components/ui/progress";

interface FileUploadProps {
  isProcessing: boolean;
  onFileSelect: (file: File) => void;
  onProcessFile: () => void;
  error?: ApiError;
  isDemoData?: boolean;
}

const FileUpload = ({ isProcessing, onFileSelect, onProcessFile, error, isDemoData }: FileUploadProps) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [processingProgress, setProcessingProgress] = useState(0);

  // Simulate processing progress when upload starts
  const simulateProgress = () => {
    if (isProcessing) {
      setProcessingProgress(0);
      const interval = setInterval(() => {
        setProcessingProgress(prev => {
          // Move slower toward the end to reflect backend processing
          const increment = prev < 70 ? 10 : prev < 90 ? 3 : 1;
          const newProgress = Math.min(prev + increment, 95);
          if (newProgress === 95) clearInterval(interval);
          return newProgress;
        });
      }, 800);
      return () => clearInterval(interval);
    } else {
      setProcessingProgress(0);
    }
  };

  // Update progress simulation when processing state changes
  useEffect(() => {
    const cleanup = simulateProgress();
    if (!isProcessing) setProcessingProgress(0);
    return cleanup;
  }, [isProcessing]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (selectedFile: File) => {
    if (selectedFile.name.endsWith('.csv')) {
      setFile(selectedFile);
      onFileSelect(selectedFile);
      
      // Format file size for better readability
      const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return `${bytes} bytes`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
      };
      
      // Log file details for debugging
      console.log(`File selected: ${selectedFile.name}, size: ${formatFileSize(selectedFile.size)}`);
      
      toast({
        title: "CSV file selected",
        description: `${selectedFile.name} (${formatFileSize(selectedFile.size)}) has been selected for processing.`,
      });
    } else {
      toast({
        title: "Invalid file type",
        description: "Please select a CSV file.",
        variant: "destructive",
      });
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleProcessClick = () => {
    if (file) {
      console.log("Processing file:", file.name);
      onProcessFile();
    }
  };

  // Format file size for display
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="mb-8 p-6 border rounded-lg">
      <h3 className="font-medium mb-4 flex items-center">
        <Database className="h-5 w-5 mr-2 text-blue-600" />
        Upload Transaction Data
      </h3>

      {isDemoData && (
        <Alert className="mb-4 border-blue-300 bg-blue-50 text-blue-800">
          <Cloud className="h-4 w-4 text-blue-600 mr-2" />
          <AlertTitle className="text-blue-600">Demo Data Active</AlertTitle>
          <AlertDescription className="text-blue-700">
            You are currently viewing demo data. To analyze real transactions, upload your own CSV file.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-4">
        <div 
          className={`border-2 border-dashed rounded-lg p-6 ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          } transition-all duration-200 flex flex-col items-center justify-center cursor-pointer`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleButtonClick}
        >
          <FileType className="h-10 w-10 text-blue-500 mb-2" />
          <p className="text-center mb-2">
            Drag and drop your CSV file here
          </p>
          <p className="text-center text-sm text-gray-500">
            or click to select from your computer
          </p>
          <p className="text-center text-xs text-blue-600 mt-1">
            Large files (1M+ rows) supported
          </p>
          <input 
            type="file" 
            accept=".csv" 
            onChange={handleFileChange}
            className="hidden"
            ref={fileInputRef}
            id="file-upload"
          />

          {file && (
            <div className="mt-4 flex items-center text-sm text-green-600 bg-green-50 p-2 rounded-md w-full">
              <FileCheck className="h-4 w-4 mr-2" />
              <span className="truncate">{file.name}</span>
              <span className="ml-auto text-xs text-gray-500">
                {formatFileSize(file.size)}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={handleProcessClick} 
            disabled={!file || isProcessing}
            className={`flex items-center gap-2 ${!file ? 'bg-gray-400' : 'bg-blue-700 hover:bg-blue-800'} text-white`}
          >
            {isProcessing ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                Processing large dataset...
              </>
            ) : (
              <>
                <Cloud className="h-4 w-4 mr-1" />
                <Upload className="h-4 w-4" />
                Process File
              </>
            )}
          </Button>
        </div>

        {isProcessing && (
          <>
            <Progress value={processingProgress} className="h-2 mt-2" />
            <Alert className="mt-2 border-blue-300 bg-blue-50 text-blue-800">
              <Cloud className="h-4 w-4 text-blue-600 mr-2" />
              <AlertTitle className="text-blue-600">Processing Large Dataset</AlertTitle>
              <AlertDescription className="text-blue-700">
                Processing a large dataset of 1M+ rows. This may take several minutes as the data is parsed and analyzed.
                The first request might take longer while the cloud server starts up.
              </AlertDescription>
            </Alert>
          </>
        )}

        {error && (
          <Alert variant="destructive" className="mt-4 border-red-300 bg-red-50 text-red-800">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-600">Error</AlertTitle>
            <AlertDescription className="text-red-700">
              {error.message}
              {(error.message?.includes('NaN') || error.message?.includes('convert string to float') || 
                error.message?.includes('missing values') || error.message?.includes('LogisticRegression')) && (
                <div className="mt-2">
                  <p>This is likely due to the format of your data. Try these fixes:</p>
                  <ul className="list-disc pl-4 mt-1">
                    <li>For job fields: Make sure they are properly formatted</li>
                    <li>For numeric fields: Ensure they contain only numbers</li>
                    <li>For missing values: Make sure all required fields are present</li>
                    <li>Try using the demo data option if you continue to experience issues</li>
                  </ul>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
