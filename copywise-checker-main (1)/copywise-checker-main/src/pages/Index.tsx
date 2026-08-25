import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Loader2, 
  FileText, 
  Upload,
  Wand2,
  GitCompare,
  Download,
  ExternalLink
} from "lucide-react";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { FAQSection } from "@/components/FAQSection";
import { HistorySidebar } from "@/components/HistorySidebar";
import { ComparisonModal } from "@/components/ComparisonModal";

interface PlagiarismResult {
  plagiarismPercentage: number;
  matches: Array<{
    text: string;
    source: string;
    similarity: number;
  }>;
  isOriginal: boolean;
}

const Index = () => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [humanizing, setHumanizing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<PlagiarismResult | null>(null);
  const [originalityLevel, setOriginalityLevel] = useState([70]);
  const [comparisonOpen, setComparisonOpen] = useState(false);
  const [documentName, setDocumentName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (20MB)
    if (file.size > 20 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size must be less than 20MB",
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Error",
        description: "Only PDF, DOCX, and TXT files are supported",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      // Upload file to storage
      const fileName = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Parse document
      const { data, error } = await supabase.functions.invoke('parse-document', {
        body: { filePath: fileName }
      });

      if (error) throw error;

      setText(data.text);
      setDocumentName(data.fileName);
      
      toast({
        title: "Document Uploaded",
        description: "Text extracted successfully",
      });
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload document",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCheck = async () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to check",
        variant: "destructive",
      });
      return;
    }

    if (text.trim().length < 50) {
      toast({
        title: "Error",
        description: "Text must be at least 50 characters long",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("check-plagiarism", {
        body: { text },
      });

      if (error) throw error;

      setResult(data);
      
      // Save to history
      await supabase.from('check_history').insert({
        original_text: text,
        plagiarism_percentage: data.plagiarismPercentage,
        matches: data.matches,
        is_original: data.isOriginal,
        document_name: documentName
      });

      toast({
        title: "Check Complete",
        description: `Plagiarism check completed successfully`,
      });
    } catch (error: any) {
      console.error("Plagiarism check error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to check plagiarism. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleHumanize = async () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to humanize",
        variant: "destructive",
      });
      return;
    }

    if (text.trim().length < 50) {
      toast({
        title: "Error",
        description: "Text must be at least 50 characters long",
        variant: "destructive",
      });
      return;
    }

    setHumanizing(true);
    try {
      const { data, error } = await supabase.functions.invoke('humanize-text', {
        body: { 
          text,
          originalityLevel: originalityLevel[0]
        }
      });

      if (error) throw error;

      setText(data.humanizedText);
      setResult(null); // Clear previous results
      
      toast({
        title: "Text Humanized",
        description: "Your content has been rewritten. Run a plagiarism check to see the new score!",
      });
    } catch (error: any) {
      console.error('Humanize error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to humanize text",
        variant: "destructive",
      });
    } finally {
      setHumanizing(false);
    }
  };

  const handleLoadHistory = (item: any) => {
    setText(item.original_text);
    setDocumentName(item.document_name);
    setResult({
      plagiarismPercentage: Number(item.plagiarism_percentage),
      matches: item.matches || [],
      isOriginal: item.is_original
    });
  };

  const handleDownloadReport = () => {
    if (!result) return;
    
    // Create a simple text report (in production, you'd generate a proper PDF)
    const report = `
PLAGIARISM REPORT
Generated: ${new Date().toLocaleString()}
${documentName ? `Document: ${documentName}` : ''}

OVERALL SCORE: ${result.plagiarismPercentage}%
STATUS: ${result.isOriginal ? 'ORIGINAL' : 'PLAGIARISM DETECTED'}

ORIGINAL TEXT:
${text}

${result.matches.length > 0 ? `
MATCHES FOUND (${result.matches.length}):
${result.matches.map((match, i) => `
${i + 1}. Similarity: ${match.similarity}%
   Source: ${match.source}
   Matched Text: ${match.text}
`).join('\n')}
` : 'No matches found'}
    `.trim();

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plagiarism-report-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Report Downloaded",
      description: "Your plagiarism report has been saved",
    });
  };

  const getStatusColor = (percentage: number) => {
    if (percentage < 20) return "default";
    if (percentage < 50) return "secondary";
    return "destructive";
  };

  const getStatusIcon = (percentage: number) => {
    if (percentage < 20) return <CheckCircle className="w-8 h-8" />;
    if (percentage < 50) return <AlertTriangle className="w-8 h-8" />;
    return <AlertTriangle className="w-8 h-8" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Hero Section */}
      <HeroSection />

      {/* Main Checker */}
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Check Your Content</h2>
          <HistorySidebar onLoadHistory={handleLoadHistory} />
        </div>

        {/* Input Section */}
        <Card className="p-8 mb-8 shadow-lg border-2 transition-all duration-300 hover:shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <label className="text-lg font-semibold">Enter or Upload Content</label>
              </div>
              
              <div className="flex gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading || loading}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Document
                    </>
                  )}
                </Button>
              </div>
            </div>

            {documentName && (
              <Badge variant="outline" className="mb-2">
                <FileText className="mr-1 h-3 w-3" />
                {documentName}
              </Badge>
            )}

            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or type your content here, or upload a document... (minimum 50 characters)"
              className="min-h-[250px] text-base resize-none focus:ring-2 focus:ring-primary transition-all duration-300"
              disabled={loading || uploading || humanizing}
            />
            
            <div className="flex items-center justify-between flex-wrap gap-4">
              <span className="text-sm text-muted-foreground">
                {text.length} characters
              </span>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleCheck}
                  disabled={loading || !text.trim() || humanizing || uploading}
                  size="lg"
                  className="px-8 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all duration-300"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-5 w-5" />
                      Check Plagiarism
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Humanize Section */}
            <div className="border-t pt-6 mt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      <Wand2 className="h-5 w-5 text-primary" />
                      Humanize Content
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Rewrite your text to improve originality
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleHumanize}
                    disabled={humanizing || loading || !text.trim() || uploading}
                  >
                    {humanizing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Rewriting...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Humanize Text
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Originality Level</span>
                    <Badge variant="outline">{originalityLevel[0]}%</Badge>
                  </div>
                  <Slider
                    value={originalityLevel}
                    onValueChange={setOriginalityLevel}
                    max={100}
                    step={10}
                    disabled={humanizing || loading}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Minimal Changes</span>
                    <span>Complete Transformation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Results Section */}
        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Overall Score */}
            <Card className="p-8 shadow-lg border-2">
              <div className="space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <h2 className="text-2xl font-bold">Analysis Results</h2>
                  <div className="flex gap-2">
                    {result.matches.length > 0 && (
                      <Button
                        variant="outline"
                        onClick={() => setComparisonOpen(true)}
                      >
                        <GitCompare className="mr-2 h-4 w-4" />
                        Compare
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={handleDownloadReport}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download Report
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div
                    className={`p-4 rounded-2xl ${
                      result.plagiarismPercentage < 20
                        ? "bg-green-500/10 text-green-600 dark:text-green-400"
                        : result.plagiarismPercentage < 50
                        ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                        : "bg-red-500/10 text-red-600 dark:text-red-400"
                    }`}
                  >
                    {getStatusIcon(result.plagiarismPercentage)}
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex items-end justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        Plagiarism Score
                      </span>
                      <span className="text-4xl font-bold">
                        {result.plagiarismPercentage}%
                      </span>
                    </div>
                    <Progress
                      value={result.plagiarismPercentage}
                      className="h-3"
                    />
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        {result.plagiarismPercentage < 20
                          ? "Excellent! Your content appears to be highly original."
                          : result.plagiarismPercentage < 50
                          ? "Moderate plagiarism detected. Consider revising some sections."
                          : "High plagiarism detected. Significant revision recommended."}
                      </p>
                      <Badge variant={getStatusColor(result.plagiarismPercentage)}>
                        {result.isOriginal ? "Original" : "Plagiarism Detected"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Matches */}
            {result.matches.length > 0 && (
              <Card className="p-8 shadow-lg border-2">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  Potential Matches Found ({result.matches.length})
                </h3>
                <div className="space-y-4">
                  {result.matches.map((match, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg bg-muted/50 space-y-3 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-sm">
                          {match.similarity}% Match
                        </Badge>
                        <a
                          href={match.source}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View Source
                        </a>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        <strong>Source:</strong> {match.source}
                      </p>
                      <p className="text-sm">
                        <strong>Matched Text:</strong> {match.text}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Features Section */}
      <FeaturesSection />

      {/* How It Works */}
      <HowItWorksSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Comparison Modal */}
      <ComparisonModal
        open={comparisonOpen}
        onOpenChange={setComparisonOpen}
        originalText={text}
        matches={result?.matches || []}
      />
    </div>
  );
};

export default Index;