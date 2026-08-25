import { Upload, Search, FileCheck, Download } from "lucide-react";

export const HowItWorksSection = () => {
  const steps = [
    {
      icon: Upload,
      title: "Upload or Paste",
      description: "Enter your text or upload a document (PDF, DOCX, TXT)"
    },
    {
      icon: Search,
      title: "AI Analysis",
      description: "Our AI scans billions of sources to detect matches"
    },
    {
      icon: FileCheck,
      title: "Review Results",
      description: "Get detailed plagiarism scores and matched sources"
    },
    {
      icon: Download,
      title: "Export Report",
      description: "Download a comprehensive PDF report of findings"
    }
  ];

  return (
    <section className="container max-w-6xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Four simple steps to ensure your content is 100% original
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 border-4 border-background shadow-lg flex items-center justify-center mb-4 relative z-10">
                <step.icon className="h-8 w-8 text-primary" />
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
              )}
              
              <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                {index + 1}
              </div>
              
              <h3 className="font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};