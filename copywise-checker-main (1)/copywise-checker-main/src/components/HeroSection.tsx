import { Shield, CheckCircle, Zap } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="container max-w-6xl mx-auto px-4 py-12 text-center">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
        <Shield className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium text-primary">Advanced Plagiarism Detection</span>
      </div>
      
      <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-blue-600 to-cyan-600 bg-clip-text text-transparent">
        Ensure Content Originality
      </h1>
      
      <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
        Our advanced plagiarism checker uses AI-powered analysis to detect copied content,
        provide detailed match reports, and help you create 100% original content.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div className="p-6 rounded-lg bg-card border border-border">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Zap className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold mb-2">Instant Analysis</h3>
          <p className="text-sm text-muted-foreground">
            Get plagiarism results in seconds with our lightning-fast AI engine
          </p>
        </div>
        
        <div className="p-6 rounded-lg bg-card border border-border">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold mb-2">99% Accuracy</h3>
          <p className="text-sm text-muted-foreground">
            Advanced AI algorithms ensure highly accurate plagiarism detection
          </p>
        </div>
        
        <div className="p-6 rounded-lg bg-card border border-border">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold mb-2">Secure & Private</h3>
          <p className="text-sm text-muted-foreground">
            Your content is encrypted and never shared with third parties
          </p>
        </div>
      </div>
    </section>
  );
};