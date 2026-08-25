import { useEffect, useState } from "react";
import { History, Trash2, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Badge } from "./ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface HistoryItem {
  id: string;
  original_text: string;
  plagiarism_percentage: number;
  is_original: boolean;
  document_name: string | null;
  created_at: string;
}

interface HistorySidebarProps {
  onLoadHistory: (item: HistoryItem) => void;
}

export const HistorySidebar = ({ onLoadHistory }: HistorySidebarProps) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadHistory = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('check_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setHistory(data || []);
    } catch (error) {
      console.error('Error loading history:', error);
      toast({
        title: "Error",
        description: "Failed to load check history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteHistoryItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('check_history')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setHistory(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Deleted",
        description: "History item removed",
      });
    } catch (error) {
      console.error('Error deleting history:', error);
      toast({
        title: "Error",
        description: "Failed to delete history item",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (percentage: number) => {
    if (percentage < 15) return "default";
    if (percentage < 40) return "secondary";
    return "destructive";
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" onClick={loadHistory}>
          <History className="mr-2 h-4 w-4" />
          History
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Check History</SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-8rem)] mt-6">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading history...
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No check history yet
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                  onClick={() => onLoadHistory(item)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {item.document_name || 'Text Check'}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteHistoryItem(item.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Badge variant={getStatusColor(Number(item.plagiarism_percentage))}>
                    {item.plagiarism_percentage}% Plagiarism
                  </Badge>
                  
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                    {item.original_text}
                  </p>
                  
                  <p className="text-xs text-muted-foreground mt-2">
                    {format(new Date(item.created_at), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};