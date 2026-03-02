import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {
  Headphones,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  MapPin,
  FileText,
  Search,
  ChevronDown,
  ChevronUp,
  Send,
  HelpCircle,
  Users,
  AlertCircle,
  CheckCircle,
  Globe,
  Building2,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";

interface SupportPageProps {
  onBack: () => void;
  isDarkMode: boolean;
}

interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high";
  createdDate: string;
  lastUpdated: string;
  description: string;
  response?: string;
}

export function SupportPage({ onBack, isDarkMode }: SupportPageProps) {
  const [selectedTab, setSelectedTab] = useState("contact");
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [searchFAQ, setSearchFAQ] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  // Ticket form state
  const [ticketForm, setTicketForm] = useState({
    category: "",
    subject: "",
    description: "",
    priority: "medium",
    contactEmail: "",
    contactPhone: "",
  });

  // Mock support tickets
  const supportTickets: SupportTicket[] = [
    {
      id: "TKT2026001",
      subject: "Unable to upload income certificate",
      category: "Technical Issue",
      status: "in-progress",
      priority: "high",
      createdDate: "2026-02-18",
      lastUpdated: "2026-02-19",
      description: "Getting error message when trying to upload my income certificate. File size is under 2MB.",
      response: "Our technical team is investigating the issue. We'll update you within 24 hours.",
    },
    {
      id: "TKT2026002",
      subject: "Query about PM-KISAN eligibility",
      category: "Scheme Information",
      status: "resolved",
      priority: "medium",
      createdDate: "2026-02-15",
      lastUpdated: "2026-02-16",
      description: "I have 1.5 hectares of land. Am I eligible for PM-KISAN scheme?",
      response: "Yes, you are eligible for PM-KISAN as farmers with landholding up to 2 hectares can apply. Please proceed with your application.",
    },
  ];

  // FAQ data
  const faqData = [
    {
      id: "1",
      category: "General",
      question: "What is Sabal Setu?",
      answer: "Sabal Setu is an AI-powered platform that helps Indian citizens discover and apply for government schemes they're eligible for. We match you with relevant schemes based on your profile and provide step-by-step guidance for applications.",
    },
    {
      id: "2",
      category: "General",
      question: "Is Sabal Setu free to use?",
      answer: "Yes, Sabal Setu is completely free for all citizens. There are no charges for using our platform, discovering schemes, or getting assistance.",
    },
    {
      id: "3",
      category: "Account",
      question: "How do I create an account?",
      answer: "Click on 'Sign Up' button, provide your basic details including email, phone number, and create a password. Verify your email/phone and complete your profile to get personalized scheme recommendations.",
    },
    {
      id: "4",
      category: "Account",
      question: "Is my personal data safe?",
      answer: "Yes, we use bank-grade encryption to protect your data. Your information is never shared with third parties without your explicit consent. We comply with all data protection regulations.",
    },
    {
      id: "5",
      category: "Schemes",
      question: "How are schemes matched to my profile?",
      answer: "Our AI algorithm analyzes your profile data (income, location, occupation, caste category, etc.) and matches it against eligibility criteria of thousands of government schemes. We show you a match percentage and explain why each scheme suits you.",
    },
    {
      id: "6",
      category: "Schemes",
      question: "Can I apply for schemes directly through Sabal Setu?",
      answer: "Sabal Setu provides all the information, documents needed, and direct links to official application portals. While the final application is submitted on government websites, we guide you through the entire process.",
    },
    {
      id: "7",
      category: "Documents",
      question: "What is OCR and how does it help?",
      answer: "OCR (Optical Character Recognition) automatically extracts information from your uploaded documents like Aadhaar, income certificates, etc. This saves you time by auto-filling form fields and helps in quick verification.",
    },
    {
      id: "8",
      category: "Documents",
      question: "What document formats are supported?",
      answer: "We support PDF, JPG, JPEG, and PNG formats. Each document should be under 5MB in size and clearly readable for best OCR results.",
    },
    {
      id: "9",
      category: "Documents",
      question: "How long are my documents stored?",
      answer: "Your documents are securely stored in encrypted format as long as your account is active. You can delete documents anytime from the Document Vault.",
    },
    {
      id: "10",
      category: "Support",
      question: "How quickly will I get a response to my query?",
      answer: "Email queries are typically responded to within 24-48 hours. Phone support is available during business hours (9 AM - 6 PM IST, Monday-Saturday). Critical issues are prioritized and addressed faster.",
    },
    {
      id: "11",
      category: "Support",
      question: "What languages does customer support handle?",
      answer: "Our support team can assist in Hindi, English, and major regional languages including Tamil, Telugu, Bengali, Marathi, Gujarati, and Kannada.",
    },
    {
      id: "12",
      category: "Complaints",
      question: "How do I track my scheme application?",
      answer: "Go to the 'Complaints & Forum' section where you can view all your active applications. Each application shows its current status and you can raise complaints if you face issues.",
    },
  ];

  const filteredFAQs = faqData.filter((faq) =>
    searchFAQ === "" ||
    faq.question.toLowerCase().includes(searchFAQ.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchFAQ.toLowerCase())
  );

  const faqCategories = Array.from(new Set(faqData.map(f => f.category)));

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-amber-100 text-amber-700";
      case "in-progress":
        return "bg-blue-100 text-blue-700";
      case "resolved":
        return "bg-green-100 text-green-700";
      case "closed":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-300";
      case "medium":
        return "bg-amber-100 text-amber-700 border-amber-300";
      case "low":
        return "bg-green-100 text-green-700 border-green-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const handleTicketSubmit = () => {
    console.log("Submitting ticket:", ticketForm);
    setShowTicketForm(false);
    setTicketForm({
      category: "",
      subject: "",
      description: "",
      priority: "medium",
      contactEmail: "",
      contactPhone: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack}>
                ← Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Headphones className="size-6 text-blue-600" />
                  Support & Helpline
                </h1>
                <p className="text-sm text-gray-600">We're here to help you 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-l-4 border-l-blue-600 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="size-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="size-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">Toll-Free Helpline</h3>
                  <p className="text-2xl font-bold text-blue-600 mb-1">1800-XXX-XXXX</p>
                  <p className="text-sm text-gray-600 mb-3">Available 9 AM - 6 PM (Mon-Sat)</p>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    <Clock className="size-3 mr-1" />
                    Open Now
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-600 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="size-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="size-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
                  <p className="text-lg font-bold text-green-600 mb-1">support@sabalsetu.gov.in</p>
                  <p className="text-sm text-gray-600 mb-3">Response within 24-48 hours</p>
                  <Button variant="outline" size="sm" className="w-full">
                    <Mail className="size-4 mr-2" />
                    Send Email
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-600 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="size-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="size-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">AI Assistant - Sabal</h3>
                  <p className="text-sm text-gray-600 mb-3">Get instant answers to common questions</p>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    <MessageCircle className="size-4 mr-2" />
                    Chat Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl mx-auto">
            <TabsTrigger value="contact">Contact Options</TabsTrigger>
            <TabsTrigger value="tickets">My Tickets</TabsTrigger>
            <TabsTrigger value="faq">FAQs</TabsTrigger>
          </TabsList>

          {/* Contact Options Tab */}
          <TabsContent value="contact" className="space-y-6">
            {/* Regional Support Centers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="size-5 text-blue-600" />
                  Regional Support Centers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      region: "North India",
                      address: "Sector 12, Dwarka, New Delhi - 110075",
                      phone: "+91-11-XXXX-XXXX",
                      email: "north@sabalsetu.gov.in",
                    },
                    {
                      region: "South India",
                      address: "Anna Salai, Chennai, Tamil Nadu - 600002",
                      phone: "+91-44-XXXX-XXXX",
                      email: "south@sabalsetu.gov.in",
                    },
                    {
                      region: "East India",
                      address: "Salt Lake, Kolkata, West Bengal - 700091",
                      phone: "+91-33-XXXX-XXXX",
                      email: "east@sabalsetu.gov.in",
                    },
                    {
                      region: "West India",
                      address: "Bandra Kurla Complex, Mumbai - 400051",
                      phone: "+91-22-XXXX-XXXX",
                      email: "west@sabalsetu.gov.in",
                    },
                  ].map((center, idx) => (
                    <Card key={idx} className="border">
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">{center.region}</h4>
                        <div className="space-y-2 text-sm">
                          <p className="flex items-start gap-2 text-gray-600">
                            <Building2 className="size-4 flex-shrink-0 mt-0.5" />
                            {center.address}
                          </p>
                          <p className="flex items-center gap-2 text-gray-600">
                            <Phone className="size-4" />
                            {center.phone}
                          </p>
                          <p className="flex items-center gap-2 text-gray-600">
                            <Mail className="size-4" />
                            {center.email}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Language Support */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="size-5 text-blue-600" />
                  Language Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Our support team can assist you in multiple languages for better communication
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Hindi", "English", "Tamil", "Telugu", "Bengali", "Marathi", "Gujarati", "Kannada", "Malayalam", "Punjabi"].map((lang, idx) => (
                    <Badge key={idx} variant="outline" className="text-sm">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Create New Ticket */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="size-5 text-blue-600" />
                  Create Support Ticket
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!showTicketForm ? (
                  <div className="text-center py-6">
                    <p className="text-gray-600 mb-4">
                      Can't find what you're looking for? Create a support ticket and our team will assist you.
                    </p>
                    <Button onClick={() => setShowTicketForm(true)} className="bg-blue-600 hover:bg-blue-700">
                      <FileText className="size-4 mr-2" />
                      Create New Ticket
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Category *</Label>
                        <Select value={ticketForm.category} onValueChange={(value) => setTicketForm({...ticketForm, category: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="technical">Technical Issue</SelectItem>
                            <SelectItem value="scheme-info">Scheme Information</SelectItem>
                            <SelectItem value="document">Document Related</SelectItem>
                            <SelectItem value="account">Account Issues</SelectItem>
                            <SelectItem value="payment">Payment/Benefits</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Priority *</Label>
                        <Select value={ticketForm.priority} onValueChange={(value) => setTicketForm({...ticketForm, priority: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label>Subject *</Label>
                      <Input
                        placeholder="Brief description of your issue"
                        value={ticketForm.subject}
                        onChange={(e) => setTicketForm({...ticketForm, subject: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label>Description *</Label>
                      <Textarea
                        placeholder="Please provide detailed information about your issue..."
                        rows={5}
                        value={ticketForm.description}
                        onChange={(e) => setTicketForm({...ticketForm, description: e.target.value})}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Contact Email *</Label>
                        <Input
                          type="email"
                          placeholder="your.email@example.com"
                          value={ticketForm.contactEmail}
                          onChange={(e) => setTicketForm({...ticketForm, contactEmail: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>Contact Phone</Label>
                        <Input
                          type="tel"
                          placeholder="+91 XXXXX XXXXX"
                          value={ticketForm.contactPhone}
                          onChange={(e) => setTicketForm({...ticketForm, contactPhone: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button variant="outline" className="flex-1" onClick={() => setShowTicketForm(false)}>
                        Cancel
                      </Button>
                      <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={handleTicketSubmit}>
                        <Send className="size-4 mr-2" />
                        Submit Ticket
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Tickets Tab */}
          <TabsContent value="tickets" className="space-y-4">
            {supportTickets.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="size-16 rounded-full bg-gray-100 flex items-center justify-center">
                    <FileText className="size-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">No support tickets</h3>
                    <p className="text-gray-600 mb-4">You haven't created any support tickets yet</p>
                    <Button onClick={() => setSelectedTab("contact")} className="bg-blue-600 hover:bg-blue-700">
                      <FileText className="size-4 mr-2" />
                      Create Your First Ticket
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {supportTickets.map((ticket) => (
                  <Card key={ticket.id} className="border-l-4 border-l-blue-600">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg text-gray-900">{ticket.subject}</h3>
                            <Badge className={getPriorityColor(ticket.priority)}>
                              {ticket.priority.toUpperCase()}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
                            <Badge variant="outline">#{ticket.id}</Badge>
                            <span>{ticket.category}</span>
                            <span>•</span>
                            <span>Created: {new Date(ticket.createdDate).toLocaleDateString('en-IN')}</span>
                          </div>
                          <p className="text-gray-700 mb-4">{ticket.description}</p>
                          <Badge className={getStatusColor(ticket.status)}>
                            <span className="capitalize">{ticket.status.replace('-', ' ')}</span>
                          </Badge>
                        </div>
                      </div>

                      {ticket.response && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                          <div className="flex gap-2">
                            <Users className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-semibold text-blue-900 mb-1">Support Team Response</p>
                              <p className="text-sm text-blue-800">{ticket.response}</p>
                              <p className="text-xs text-blue-600 mt-2">
                                Last updated: {new Date(ticket.lastUpdated).toLocaleDateString('en-IN')}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6">
            {/* Search FAQs */}
            <Card>
              <CardContent className="p-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-400" />
                  <Input
                    placeholder="Search frequently asked questions..."
                    value={searchFAQ}
                    onChange={(e) => setSearchFAQ(e.target.value)}
                    className="pl-10 text-base"
                  />
                </div>
              </CardContent>
            </Card>

            {/* FAQ Categories */}
            {faqCategories.map((category) => {
              const categoryFAQs = filteredFAQs.filter(f => f.category === category);
              if (categoryFAQs.length === 0) return null;

              return (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HelpCircle className="size-5 text-blue-600" />
                      {category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible>
                      {categoryFAQs.map((faq) => (
                        <AccordionItem key={faq.id} value={faq.id}>
                          <AccordionTrigger className="text-left">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent>
                            <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              );
            })}

            {filteredFAQs.length === 0 && (
              <Card className="p-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <HelpCircle className="size-12 text-gray-400" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">No FAQs found</h3>
                    <p className="text-gray-600 mb-4">
                      Try different keywords or contact our support team
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Service Level Agreement */}
        <Card className="mt-8 border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <CheckCircle className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-900 mb-2">Our Support Commitment</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-green-800">
                  <div>
                    <p className="font-medium">Email Support</p>
                    <p>Response within 24-48 hours</p>
                  </div>
                  <div>
                    <p className="font-medium">Phone Support</p>
                    <p>Immediate assistance during business hours</p>
                  </div>
                  <div>
                    <p className="font-medium">Critical Issues</p>
                    <p>Prioritized resolution within 6 hours</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
