import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Progress } from "./ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Home,
  Users,
  CreditCard,
  FileText,
  Edit,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { userAPI } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";

interface ProfilePageProps {
  onBack: () => void;
  isDarkMode: boolean;
}

export function ProfilePage({ onBack, isDarkMode }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { refreshUser } = useAuth();

  // User profile data - loaded from API
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
    state: "",
    district: "",
    category: "",
    annualIncome: "",
    occupation: "",
    education: "",
    aadhaarNumber: "",
    panNumber: "",
    bankAccountNo: "",
    bankIfsc: "",
    profileCompletion: 0,
  });

  // Keep original data for cancel
  const [originalData, setOriginalData] = useState(profileData);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await userAPI.getProfile();
      const user = res.data.user;
      const mapped = {
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        age: user.age ? String(user.age) : "",
        gender: user.gender || "",
        state: user.state || "",
        district: user.district || "",
        category: user.category || "",
        annualIncome: user.annualIncome ? String(user.annualIncome) : "",
        occupation: user.occupation || "",
        education: user.education || "",
        aadhaarNumber: user.aadhaarNumber || "",
        panNumber: user.panNumber || "",
        bankAccountNo: user.bankAccountNo || "",
        bankIfsc: user.bankIfsc || "",
        profileCompletion: user.profileCompletion || 0,
      };
      setProfileData(mapped);
      setOriginalData(mapped);
    } catch (err: any) {
      console.error("Failed to load profile:", err);
      setError("Failed to load profile data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      const updatePayload: any = {};
      // Only send changed fields
      const fieldsToSend = ['fullName', 'phone', 'age', 'gender', 'state', 'district',
        'category', 'annualIncome', 'occupation', 'education',
        'aadhaarNumber', 'panNumber', 'bankAccountNo', 'bankIfsc'];
      for (const field of fieldsToSend) {
        const val = (profileData as any)[field];
        if (val !== (originalData as any)[field]) {
          updatePayload[field] = val;
        }
      }
      if (Object.keys(updatePayload).length > 0) {
        const res = await userAPI.updateProfile(updatePayload);
        const user = res.data.user;
        const mapped = {
          fullName: user.fullName || "",
          email: profileData.email,
          phone: user.phone || "",
          age: user.age ? String(user.age) : "",
          gender: user.gender || "",
          state: user.state || "",
          district: user.district || "",
          category: user.category || "",
          annualIncome: user.annualIncome ? String(user.annualIncome) : "",
          occupation: user.occupation || "",
          education: user.education || "",
          aadhaarNumber: user.aadhaarNumber || "",
          panNumber: user.panNumber || "",
          bankAccountNo: user.bankAccountNo || "",
          bankIfsc: user.bankIfsc || "",
          profileCompletion: user.profileCompletion || 0,
        };
        setProfileData(mapped);
        setOriginalData(mapped);
        // Refresh auth context so navbar etc. reflect updated name
        await refreshUser();
      }
      setIsEditing(false);
    } catch (err: any) {
      console.error("Failed to save profile:", err);
      setError("Failed to save profile changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setProfileData(originalData);
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const profileCompletion = profileData.profileCompletion;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-gray-600 text-lg">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack}>
                ← Back
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            </div>
            <div className="flex items-center gap-3">
              {error && (
                <span className="text-sm text-red-600">{error}</span>
              )}
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Edit className="size-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={handleCancel} disabled={saving}>
                    <X className="size-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700" disabled={saving}>
                    {saving ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Save className="size-4 mr-2" />}
                    Save Changes
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Profile Header Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <Avatar className="size-24 bg-gradient-to-br from-blue-600 to-green-600">
                <AvatarFallback className="text-white text-2xl">
                  {getInitials(profileData.fullName)}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{profileData.fullName || "Complete your profile"}</h2>
                <p className="text-gray-600 mb-3">{profileData.email}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {profileData.category && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                      <User className="size-3 mr-1" />
                      {profileData.category}
                    </Badge>
                  )}
                  {profileData.occupation && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      <Briefcase className="size-3 mr-1" />
                      {profileData.occupation}
                    </Badge>
                  )}
                  {profileData.district && profileData.state && (
                    <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                      <MapPin className="size-3 mr-1" />
                      {profileData.district}, {profileData.state}
                    </Badge>
                  )}
                </div>

                {/* Profile Completion */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">Profile Completion</span>
                    <span className="font-bold text-gray-900">{profileCompletion}%</span>
                  </div>
                  <Progress value={profileCompletion} className="h-2" />
                  {profileCompletion < 100 && (
                    <p className="text-xs text-amber-600 flex items-center gap-1">
                      <AlertCircle className="size-3" />
                      Complete your profile to unlock all features and better scheme matches
                    </p>
                  )}
                  {profileCompletion === 100 && (
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <CheckCircle className="size-3" />
                      Your profile is complete!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="size-5 text-blue-600" />
                Personal Information
              </CardTitle>
              <CardDescription>Your basic personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Full Name</Label>
                  {isEditing ? (
                    <Input
                      value={profileData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profileData.fullName || "Not provided"}</p>
                  )}
                </div>

                <div>
                  <Label>Age</Label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={profileData.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                      placeholder="Enter your age"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profileData.age ? `${profileData.age} years` : "Not provided"}</p>
                  )}
                </div>

                <div>
                  <Label>Gender</Label>
                  {isEditing ? (
                    <Select value={profileData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-gray-900 font-medium">{profileData.gender || "Not provided"}</p>
                  )}
                </div>

                <div>
                  <Label>Category</Label>
                  {isEditing ? (
                    <Select value={profileData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="General">General</SelectItem>
                        <SelectItem value="OBC">OBC</SelectItem>
                        <SelectItem value="SC">SC</SelectItem>
                        <SelectItem value="ST">ST</SelectItem>
                        <SelectItem value="EWS">EWS</SelectItem>
                        <SelectItem value="Minority">Minority</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-gray-900 font-medium">{profileData.category || "Not provided"}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="size-5 text-blue-600" />
                Contact Information
              </CardTitle>
              <CardDescription>How we can reach you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="flex items-center gap-2">
                  <Mail className="size-4" />
                  Email Address
                </Label>
                <p className="text-gray-900 font-medium">{profileData.email}</p>
                <p className="text-xs text-gray-500">Email cannot be changed</p>
              </div>

              <div>
                <Label className="flex items-center gap-2">
                  <Phone className="size-4" />
                  Phone Number
                </Label>
                {isEditing ? (
                  <Input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{profileData.phone || "Not provided"}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="size-5 text-blue-600" />
                Address Information
              </CardTitle>
              <CardDescription>Your residential details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>State</Label>
                  {isEditing ? (
                    <Input
                      value={profileData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      placeholder="Enter state"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profileData.state || "Not provided"}</p>
                  )}
                </div>

                <div>
                  <Label>District</Label>
                  {isEditing ? (
                    <Input
                      value={profileData.district}
                      onChange={(e) => handleInputChange("district", e.target.value)}
                      placeholder="Enter district"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profileData.district || "Not provided"}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="size-5 text-blue-600" />
                Financial Information
              </CardTitle>
              <CardDescription>Income and financial details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Annual Income</Label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={profileData.annualIncome}
                      onChange={(e) => handleInputChange("annualIncome", e.target.value)}
                      placeholder="Enter annual income"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">
                      {profileData.annualIncome ? `₹ ${parseInt(profileData.annualIncome).toLocaleString('en-IN')}` : "Not provided"}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Aadhaar Number</Label>
                  {isEditing ? (
                    <Input
                      value={profileData.aadhaarNumber}
                      onChange={(e) => handleInputChange("aadhaarNumber", e.target.value)}
                      placeholder="Enter Aadhaar number"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profileData.aadhaarNumber || "Not provided"}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>PAN Number</Label>
                  {isEditing ? (
                    <Input
                      value={profileData.panNumber}
                      onChange={(e) => handleInputChange("panNumber", e.target.value)}
                      placeholder="Enter PAN number"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profileData.panNumber || "Not provided"}</p>
                  )}
                </div>

                <div>
                  <Label>Bank Account No.</Label>
                  {isEditing ? (
                    <Input
                      value={profileData.bankAccountNo}
                      onChange={(e) => handleInputChange("bankAccountNo", e.target.value)}
                      placeholder="Enter bank account number"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profileData.bankAccountNo || "Not provided"}</p>
                  )}
                </div>
              </div>

              <div>
                <Label>IFSC Code</Label>
                {isEditing ? (
                  <Input
                    value={profileData.bankIfsc}
                    onChange={(e) => handleInputChange("bankIfsc", e.target.value)}
                    placeholder="Enter IFSC code"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{profileData.bankIfsc || "Not provided"}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Employment & Education */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="size-5 text-blue-600" />
                Employment & Education
              </CardTitle>
              <CardDescription>Professional and educational background</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="flex items-center gap-2">
                  <GraduationCap className="size-4" />
                  Education Level
                </Label>
                {isEditing ? (
                  <Select value={profileData.education} onValueChange={(value) => handleInputChange("education", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select education level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Below 10th">Below 10th</SelectItem>
                      <SelectItem value="10th Pass">10th Pass</SelectItem>
                      <SelectItem value="12th Pass">12th Pass</SelectItem>
                      <SelectItem value="Graduate">Graduate</SelectItem>
                      <SelectItem value="Post Graduate">Post Graduate</SelectItem>
                      <SelectItem value="Doctorate">Doctorate</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-gray-900 font-medium">{profileData.education || "Not provided"}</p>
                )}
              </div>

              <div>
                <Label>Occupation</Label>
                {isEditing ? (
                  <Input
                    value={profileData.occupation}
                    onChange={(e) => handleInputChange("occupation", e.target.value)}
                    placeholder="Enter your occupation"
                  />
                ) : (
                  <p className="text-gray-900 font-medium">{profileData.occupation || "Not provided"}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Important Notice */}
        <Card className="mt-6 border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <AlertCircle className="size-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-900 mb-1">Data Privacy & Security</h4>
                <p className="text-sm text-amber-800">
                  Your personal information is encrypted and securely stored. We use this information only to match you with
                  eligible government schemes. Your data will never be shared with third parties without your explicit consent.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
