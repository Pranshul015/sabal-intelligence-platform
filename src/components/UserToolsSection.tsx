import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { User, MessageSquare, ThumbsUp, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";

const recentPosts = [
  {
    id: 1,
    author: "Rajesh Kumar",
    initials: "RK",
    topic: "PM Awas Yojana Application Process",
    excerpt: "I recently applied for PM Awas Yojana. Here's my experience and timeline...",
    replies: 12,
    likes: 24
  },
  {
    id: 2,
    author: "Priya Sharma",
    initials: "PS",
    topic: "Scholarship Disbursement Delayed",
    excerpt: "My scholarship through NSP has been delayed by 2 months. Anyone facing similar issues?",
    replies: 8,
    likes: 15
  },
  {
    id: 3,
    author: "Amit Patel",
    initials: "AP",
    topic: "Document Verification Tips",
    excerpt: "Sharing some tips that helped me get my documents verified quickly for Ayushman Bharat...",
    replies: 19,
    likes: 42
  }
];

export function UserToolsSection() {
  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Manage Profile Card */}
          <Card className="border-2 hover:border-blue-300 transition-colors">
            <CardHeader>
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <User className="w-7 h-7 text-blue-600" />
              </div>
              <CardTitle className="text-gray-900">Manage Your Profile</CardTitle>
              <CardDescription className="text-gray-600">
                Keep your information up-to-date to receive accurate scheme recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Personal Information</span>
                  <Button variant="ghost" size="sm" className="text-blue-600">
                    Update
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Uploaded Documents</span>
                  <Button variant="ghost" size="sm" className="text-blue-600">
                    View
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Application History</span>
                  <Button variant="ghost" size="sm" className="text-blue-600">
                    Track
                  </Button>
                </div>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4">
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>

          {/* Complaints Forum Card */}
          <Card className="border-2 hover:border-green-300 transition-colors">
            <CardHeader>
              <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="w-7 h-7 text-green-600" />
              </div>
              <CardTitle className="text-gray-900">Community Forum</CardTitle>
              <CardDescription className="text-gray-600">
                Connect with others, share experiences, and get help with scheme applications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {recentPosts.map((post) => (
                  <div key={post.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="flex items-start gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-blue-600 text-white text-xs">
                          {post.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-900">{post.topic}</p>
                        <p className="text-gray-500 text-sm truncate">{post.excerpt}</p>
                        <div className="flex items-center gap-4 mt-2 text-gray-500 text-xs">
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-3 h-3" />
                            {post.replies}
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="w-3 h-3" />
                            {post.likes}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white mt-4">
                Visit Forum
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
