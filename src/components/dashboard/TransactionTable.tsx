
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ProcessedTransaction } from "@/types/transaction";

interface TransactionTableProps {
  transactions: ProcessedTransaction[];
  title: string;
  titleColor?: string;
  icon?: string;
  rowClassName?: string;
}

const TransactionTable = ({ 
  transactions, 
  title, 
  titleColor = "text-gray-800",
  icon = "",
  rowClassName = ""
}: TransactionTableProps) => {
  
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

  return (
    <div>
      <h3 className={`text-lg font-medium mb-4 ${titleColor}`}>
        {icon} {title}
      </h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Merchant</TableHead>
            <TableHead>Probability</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length > 0 ? (
            transactions.map((tx) => (
              <TableRow key={tx.id || `tx-${Math.random()}`} className={rowClassName}>
                <TableCell className="font-medium">{tx.id || tx.trans_num || 'Unknown'}</TableCell>
                <TableCell>{formatAmount(tx.amount || tx.amt)}</TableCell>
                <TableCell>{formatDate(tx.date || tx.trans_date_trans_time)}</TableCell>
                <TableCell>{tx.merchant || 'Unknown'}</TableCell>
                <TableCell>{((tx.fraud_probability || 0) * 100).toFixed(2)}%</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">No transactions found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionTable;
