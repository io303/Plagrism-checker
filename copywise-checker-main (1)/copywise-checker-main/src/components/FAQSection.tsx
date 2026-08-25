import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

export const FAQSection = () => {
  const faqs = [
    {
      question: "How accurate is the plagiarism detection?",
      answer: "Our AI-powered plagiarism checker has a 99% accuracy rate. It compares your text against billions of web pages, academic papers, and published content to identify even subtle matches."
    },
    {
      question: "What file formats are supported?",
      answer: "We support PDF, DOCX (Microsoft Word), and plain text (TXT) files up to 20MB in size. Simply upload your document and we'll extract the text for analysis."
    },
    {
      question: "Is my content stored or shared?",
      answer: "Your privacy is our priority. All content is encrypted during transmission and analysis. We do not store your documents permanently or share them with third parties."
    },
    {
      question: "What does the 'Humanize' feature do?",
      answer: "The Humanize feature uses AI to rewrite your text while preserving its meaning. You can adjust the originality level from 0-100% to control how much the text is modified. This helps improve originality scores."
    },
    {
      question: "Can I download my plagiarism reports?",
      answer: "Yes! You can download detailed PDF reports that include the plagiarism percentage, matched sources, and highlighted text. These reports are perfect for documentation and verification."
    },
    {
      question: "How long is my check history saved?",
      answer: "Your check history is saved indefinitely. You can access all previous checks, view results, and re-download reports at any time from the History sidebar."
    }
  ];

  return (
    <section className="container max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
        <p className="text-muted-foreground">
          Find answers to common questions about our plagiarism checker
        </p>
      </div>
      
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};