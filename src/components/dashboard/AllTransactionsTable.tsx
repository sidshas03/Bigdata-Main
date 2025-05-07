
import { useState } from "react";
import { Table as TableIcon, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Table as UITable, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ProcessedTransaction } from "@/types/transaction";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious,
  PaginationEllipsis
} from "@/components/ui/pagination";

interface AllTransactionsTableProps {
  transactions: ProcessedTransaction[];
}

const AllTransactionsTable = ({ transactions }: AllTransactionsTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10000; // Increased to 10,000 rows per page for ultra-large datasets

  // Format amount for display
  const formatAmount = (amount: number | undefined): string => {
    // Ensure amount is a valid number
    if (amount === undefined || isNaN(amount)) {
      return '$0.00';
    }
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format date for display
  const formatDate = (date: string | undefined): string => {
    if (!date) return 'N/A';
    
    // Try to standardize date format
    try {
      // Check if it's already in MM/DD/YYYY format
      if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(date)) {
        return date;
      }
      
      // Otherwise try to parse as a date
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) {
        return date; // Return original if parsing fails
      }
      
      return dateObj.toLocaleDateString();
    } catch (e) {
      return date;
    }
  };
  
  // Filter transactions based on search query - with memoization optimization
  const filteredTransactions = (() => {
    if (!searchQuery) return transactions;
    
    const query = searchQuery.toLowerCase();
    return transactions.filter((tx) => {
      const txId = String(tx.id || '').toLowerCase();
      return txId.includes(query);
    });
  })();

  // Calculate total number of pages
  const totalPages = Math.ceil(filteredTransactions.length / rowsPerPage);
  
  // Get current page transactions - only compute the visible page for performance
  const currentTransactions = filteredTransactions.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // Direct page jumping for extremely large datasets
  const handleJumpToPage = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLInputElement;
      const page = parseInt(target.value);
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
      target.value = '';
    }
  };

  // Generate page numbers for pagination with more efficient navigation
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 3; // Show fewer pages for extremely large datasets
    
    if (totalPages <= maxPagesToShow) {
      // If total pages are less than max pages to show, display all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // For extremely large datasets, show more strategic page numbers
      
      // Always show first page
      pageNumbers.push(1);
      
      // Calculate middle pages - for ultra-large datasets, be even more selective
      if (currentPage <= 2) {
        // Near the beginning
        if (currentPage > 1) pageNumbers.push(currentPage);
      } else if (currentPage >= totalPages - 1) {
        // Near the end
        if (currentPage < totalPages) pageNumbers.push(currentPage);
      } else {
        // Somewhere in the middle - just show current
        pageNumbers.push(currentPage);
      }
      
      // Add ellipsis if needed
      if (currentPage > 2) {
        pageNumbers.splice(1, 0, "...");
      }
      
      if (currentPage < totalPages - 1) {
        pageNumbers.push("...");
      }
      
      // Always show last page
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };
  
  // Handle large jumps for extremely large datasets
  const handleJumpPages = (direction: 'start' | 'back' | 'forward' | 'end') => {
    switch(direction) {
      case 'start':
        setCurrentPage(1);
        break;
      case 'back':
        setCurrentPage(Math.max(1, currentPage - 100)); // Jump 100 pages at a time
        break;
      case 'forward':
        setCurrentPage(Math.min(totalPages, currentPage + 100)); // Jump 100 pages at a time
        break;
      case 'end':
        setCurrentPage(totalPages);
        break;
    }
  };

  // Fast navigation to page number
  const handleFastJump = (targetPercentage: number) => {
    const targetPage = Math.max(1, Math.min(totalPages, Math.round(totalPages * targetPercentage)));
    setCurrentPage(targetPage);
  };

  return (
    <Card className="p-4 border border-gray-200">
      <CardContent className="p-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <TableIcon className="h-5 w-5 mr-2 text-blue-600" />
            <h3 className="text-lg font-medium text-gray-800">All Transactions</h3>
          </div>
          
          {/* Search and pagination controls */}
          <div className="flex items-center gap-2 flex-wrap justify-end">
            {/* Search input */}
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search transaction ID..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset to first page when searching
                }}
              />
            </div>
            
            {/* Jump to page input - Visible for large datasets */}
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">Go to page:</span>
              <Input 
                className="w-20 text-center"
                placeholder={currentPage.toString()}
                onKeyDown={handleJumpToPage}
                type="number"
                min="1"
                max={totalPages}
              />
            </div>
            
            {/* Fast navigation for million+ record datasets */}
            {totalPages > 100 && (
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-500 mr-1">Jump:</span>
                <button 
                  className="px-2 py-1 text-xs bg-blue-50 hover:bg-blue-100 rounded border border-blue-200"
                  onClick={() => handleFastJump(0.25)}
                >
                  25%
                </button>
                <button 
                  className="px-2 py-1 text-xs bg-blue-50 hover:bg-blue-100 rounded border border-blue-200"
                  onClick={() => handleFastJump(0.5)}
                >
                  50%
                </button>
                <button 
                  className="px-2 py-1 text-xs bg-blue-50 hover:bg-blue-100 rounded border border-blue-200"
                  onClick={() => handleFastJump(0.75)}
                >
                  75%
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Table stats */}
        <div className="mb-2 text-sm text-gray-500">
          <div className="flex justify-between flex-wrap gap-2">
            <span>
              Page {currentPage} of {totalPages} 
              {totalPages > 0 && (
                <span> (rows {(currentPage - 1) * rowsPerPage + 1}-{Math.min(currentPage * rowsPerPage, filteredTransactions.length)} of {filteredTransactions.length})</span>
              )}
              {filteredTransactions.length !== transactions.length && (
                <> (filtered from {transactions.length} total)</>
              )}
            </span>
            <span className="text-blue-600 font-medium">
              Total Records: {transactions.length.toLocaleString()}
            </span>
          </div>
        </div>
        
        {/* Table with fixed height and scrolling */}
        <div className="border border-gray-200 rounded-md">
          <div className="overflow-hidden">
            <div className="bg-white rounded-t-md">
              <UITable>
                <TableHeader className="sticky top-0 z-10 bg-gray-50">
                  <TableRow className="border-b border-gray-200">
                    <TableHead className="bg-gray-50 py-3">ID</TableHead>
                    <TableHead className="bg-gray-50 py-3">Amount</TableHead>
                    <TableHead className="bg-gray-50 py-3">Date</TableHead>
                    <TableHead className="bg-gray-50 py-3">Merchant</TableHead>
                    <TableHead className="bg-gray-50 py-3">Risk Level</TableHead>
                    <TableHead className="bg-gray-50 py-3">Probability</TableHead>
                  </TableRow>
                </TableHeader>
              </UITable>
            </div>
            
            <ScrollArea className="h-[350px] overflow-auto rounded-b-md">
              <UITable>
                <TableBody>
                  {currentTransactions.length > 0 ? (
                    currentTransactions.map((tx, index) => {
                      let rowColorClass = index % 2 === 0 ? "bg-white" : "bg-gray-50";
                      
                      if (tx.risk_level === "High") rowColorClass += " bg-red-50";
                      else if (tx.risk_level === "Medium") rowColorClass += " bg-yellow-50";
                      else if (tx.risk_level === "Low") rowColorClass += " bg-green-50";
                      
                      return (
                        <TableRow 
                          key={tx.id || `tx-${index}`} 
                          className={`${rowColorClass} hover:bg-blue-50 transition-colors duration-150 ease-in-out border-b border-gray-200`}
                        >
                          <TableCell className="font-medium">{tx.id || 'Unknown'}</TableCell>
                          <TableCell>{formatAmount(tx.amount)}</TableCell>
                          <TableCell>{formatDate(tx.date)}</TableCell>
                          <TableCell>{tx.merchant || 'Unknown'}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                tx.risk_level === "High"
                                  ? "bg-red-100 text-red-800"
                                  : tx.risk_level === "Medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {tx.risk_level || 'Unknown'}
                            </span>
                          </TableCell>
                          <TableCell>{((tx.fraud_probability || 0) * 100).toFixed(2)}%</TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow className="border-b border-gray-200">
                      <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                        {searchQuery ? "No transactions match your search" : "No transactions found"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </UITable>
            </ScrollArea>
          </div>
        </div>
        
        {/* Enhanced Pagination for Ultra-Large Datasets */}
        {totalPages > 1 && (
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                {/* First page and jump back controls */}
                <PaginationItem>
                  <PaginationLink 
                    onClick={() => handleJumpPages('start')}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  >
                    First
                  </PaginationLink>
                </PaginationItem>
                {currentPage > 100 && (
                  <PaginationItem>
                    <PaginationLink 
                      onClick={() => handleJumpPages('back')}
                      className="cursor-pointer"
                    >
                      -100
                    </PaginationLink>
                  </PaginationItem>
                )}
                
                {/* Previous page */}
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(currentPage - 1)}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {/* Page numbers */}
                {getPageNumbers().map((page, index) => (
                  <PaginationItem key={index}>
                    {page === "..." ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        isActive={page === currentPage}
                        onClick={() => typeof page === 'number' && handlePageChange(page)}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}
                
                {/* Next page */}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(currentPage + 1)}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {/* Jump forward and last page controls */}
                {currentPage < totalPages - 100 && (
                  <PaginationItem>
                    <PaginationLink 
                      onClick={() => handleJumpPages('forward')}
                      className="cursor-pointer"
                    >
                      +100
                    </PaginationLink>
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationLink 
                    onClick={() => handleJumpPages('end')}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  >
                    Last
                  </PaginationLink>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AllTransactionsTable;
