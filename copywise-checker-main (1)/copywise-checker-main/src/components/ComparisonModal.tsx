import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";

interface Match {
  source: string;
  similarity: number;
  text: string;
}

interface ComparisonModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  originalText: string;
  matches: Match[];
}

export const ComparisonModal = ({
  open,
  onOpenChange,
  originalText,
  matches
}: ComparisonModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Side-by-Side Comparison</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[60vh]">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              Original Text
              <Badge variant="outline">Your Content</Badge>
            </h3>
            <ScrollArea className="h-[calc(60vh-4rem)]">
              <p className="text-sm whitespace-pre-wrap">{originalText}</p>
            </ScrollArea>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              Matched Sources
              <Badge variant="destructive">{matches.length} Matches</Badge>
            </h3>
            <ScrollArea className="h-[calc(60vh-4rem)]">
              <div className="space-y-4">
                {matches.map((match, index) => (
                  <div key={index} className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary">
                        {match.similarity}% Match
                      </Badge>
                      <a
                        href={match.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline truncate max-w-[200px]"
                      >
                        {match.source}
                      </a>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {match.text}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};