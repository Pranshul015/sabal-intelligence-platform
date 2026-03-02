import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

const faqs = [
  {
    question: "How to Apply for Government Schemes?",
    answer: "Applying for government schemes through Sabal Setu is simple. First, create your profile with accurate information. Upload required documents for verification. Our AI will then recommend eligible schemes. Click on any scheme to see detailed eligibility criteria and application process. You can apply directly through our portal or get redirected to the official scheme website."
  },
  {
    question: "Eligibility Tips and Best Practices",
    answer: "To improve your eligibility: Keep all your documents updated and verified. Regularly update your profile with any changes in income, address, or family status. Check for schemes specific to your state or district. Many schemes have category-specific quotas (SC/ST/OBC/General). Ensure your income certificate is current (usually valid for 1 year). For agricultural schemes, keep land records handy."
  },
  {
    question: "What Documents Do I Need?",
    answer: "Common documents required include: Aadhaar Card (mandatory for most schemes), Income Certificate (from Tehsildar or equivalent authority), Residence Proof (Ration Card, Voter ID, or Utility Bills), Bank Account details with cancelled cheque, Caste Certificate (if applicable), Educational Certificates (for scholarship schemes), and Property Documents (for housing schemes). Always check specific scheme requirements."
  },
  {
    question: "How Does Document OCR Work?",
    answer: "Our OCR (Optical Character Recognition) technology automatically extracts information from your uploaded documents. Simply upload clear photos or scans of your documents. The system will detect document type, extract relevant fields like name, date of birth, ID numbers, and populate your profile automatically. You can review and edit the extracted information before saving. This saves time and reduces manual data entry errors."
  },
  {
    question: "Is My Data Secure?",
    answer: "Absolutely. We take data security seriously. All documents are encrypted during upload and storage. We use bank-grade SSL encryption for data transmission. Your personal information is never shared with third parties without your consent. Access to your data is strictly controlled and logged. We comply with all government data protection regulations. You can delete your data anytime from your dashboard."
  },
  {
    question: "How Often Are Schemes Updated?",
    answer: "Our database is updated in real-time through API integration with government portals. New schemes are added as soon as they're announced. Existing scheme details, deadlines, and eligibility criteria are checked and updated daily. We also send notifications about new schemes matching your profile and alerts about approaching application deadlines."
  },
  {
    question: "Can I Track My Application Status?",
    answer: "Yes! Once you apply through our portal, you can track your application status in your dashboard. For applications made through official government portals, we provide tracking links and guidance. You'll receive notifications at each stage: Application submitted, Under review, Documents verified, Approved/Rejected. You can also set up SMS and email alerts for status updates."
  },
  {
    question: "What If I'm Rejected?",
    answer: "If your application is rejected, don't worry. Check the rejection reason in your dashboard. Common reasons include incomplete documentation, eligibility criteria not met, or quota exhaustion. You can reapply after addressing the issues. Use our forum to seek advice from others who successfully applied. Our support team can also help review your application and suggest improvements."
  }
];

export function EducationResources() {
  return (
    <section className="py-16 sm:py-24 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600">
            Everything you need to know about finding and applying for government schemes
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-gray-900 hover:text-blue-600">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <a href="#contact" className="text-blue-600 hover:text-blue-700">
            Contact our support team →
          </a>
        </div>
      </div>
    </section>
  );
}