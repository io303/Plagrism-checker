import { FileText, History, FileBarChart, GitCompare, Wand2 } from "lucide-react";
import { Card } from "./ui/card";

export const FeaturesSection = () => {
  const features = [
    {
      icon: FileText,
      title: "Document Upload",
      description: "Support for PDF, DOCX, and TXT files up to 20MB"
    },
    {
      icon: History,
      title: "Check History",
      description: "Access all your previous plagiarism checks and results"
    },
    {
      icon: FileBarChart,
      title: "Detailed Reports",
      description: "Download comprehensive PDF reports with full analysis"
    },
    {
      icon: GitCompare,
      title: "Comparison View",
      description: "Side-by-side comparison of original text vs matched sources"
    },
    {
      icon: Wand2,
      title: "Humanize Content",
      description: "AI-powered text rewriting to improve originality scores"
    }
  ];

  return (
    <section className="container max-w-6xl mx-auto px-4 py-16 bg-muted/30 rounded-3xl my-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Everything you need to ensure content originality and academic integrity
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <feature.icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
};