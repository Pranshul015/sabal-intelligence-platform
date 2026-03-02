import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Globe,
  Moon,
  Download,
  Trash2,
  Lock,
  Mail,
  Smartphone,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "./ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { authAPI } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";

interface SettingsPageProps {
  onBack: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export function SettingsPage({ onBack, isDarkMode, onToggleDarkMode }: SettingsPageProps) {
  const { logout } = useAuth();
  const [selectedTab, setSelectedTab] = useState("general");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordChanging, setPasswordChanging] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    // General
    language: "en",
    theme: isDarkMode ? "dark" : "light",

    // Notifications
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    schemeUpdates: true,
    applicationAlerts: true,
    documentExpiry: true,
    marketingEmails: false,

    // Privacy
    profileVisibility: "private",
    dataSharing: false,
    analyticsTracking: true,

    // Security
    twoFactorAuth: false,
    loginAlerts: true,
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handlePasswordChange = async () => {
    setPasswordError("");
    setPasswordSuccess(false);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }

    try {
      setPasswordChanging(true);
      await authAPI.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordSuccess(true);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => {
        setShowPasswordChange(false);
        setPasswordSuccess(false);
      }, 2000);
    } catch (error: any) {
      setPasswordError(error.response?.data?.error || "Failed to change password");
    } finally {
      setPasswordChanging(false);
    }
  };

  const handleDataDownload = () => {
    console.log("Downloading user data...");
  };

  const handleAccountDelete = async () => {
    try {
      setDeletingAccount(true);
      await authAPI.deleteAccount();
      logout();
    } catch (error: any) {
      console.error("Failed to delete account:", error);
      setDeletingAccount(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}>
              ← Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <SettingsIcon className="size-6 text-blue-600" />
                Settings
              </h1>
              <p className="text-sm text-gray-600">Manage your account preferences and privacy</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-3xl mx-auto">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="size-5 text-blue-600" />
                  Language & Region
                </CardTitle>
                <CardDescription>Choose your preferred language and regional settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Display Language</Label>
                  <Select value={settings.language} onValueChange={(value) => handleSettingChange("language", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">हिन्दी (Hindi)</SelectItem>
                      <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                      <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
                      <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
                      <SelectItem value="mr">मराठी (Marathi)</SelectItem>
                      <SelectItem value="gu">ગુજરાતી (Gujarati)</SelectItem>
                      <SelectItem value="kn">ಕನ್ನಡ (Kannada)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-600 mt-1">
                    Changes will apply across the entire platform
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Moon className="size-5 text-blue-600" />
                  Appearance
                </CardTitle>
                <CardDescription>Customize how Sabal Setu looks on your device</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Dark Mode</p>
                    <p className="text-sm text-gray-600">Use dark theme for better visibility at night</p>
                  </div>
                  <Switch checked={isDarkMode} onCheckedChange={onToggleDarkMode} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Download or delete your account data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Download className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-900">Download Your Data</p>
                      <p className="text-sm text-blue-700">
                        Get a copy of your profile, documents, and application history
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={handleDataDownload}>
                    Download
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Trash2 className="size-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-900">Delete Account</p>
                      <p className="text-sm text-red-700">
                        Permanently delete your account and all associated data
                      </p>
                    </div>
                  </div>
                  <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="size-5 text-blue-600" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>Choose how and when you want to be notified</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Notification Channels */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Notification Channels</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Mail className="size-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900">Email Notifications</p>
                          <p className="text-sm text-gray-600">Receive updates via email</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.emailNotifications}
                        onCheckedChange={(value) => handleSettingChange("emailNotifications", value)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Smartphone className="size-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900">SMS Notifications</p>
                          <p className="text-sm text-gray-600">Get text messages for important updates</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.smsNotifications}
                        onCheckedChange={(value) => handleSettingChange("smsNotifications", value)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Bell className="size-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900">Push Notifications</p>
                          <p className="text-sm text-gray-600">Browser notifications for instant alerts</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.pushNotifications}
                        onCheckedChange={(value) => handleSettingChange("pushNotifications", value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-4">What to Notify</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Scheme Updates</p>
                        <p className="text-sm text-gray-600">New schemes matching your profile</p>
                      </div>
                      <Switch
                        checked={settings.schemeUpdates}
                        onCheckedChange={(value) => handleSettingChange("schemeUpdates", value)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Application Alerts</p>
                        <p className="text-sm text-gray-600">Status updates on your applications</p>
                      </div>
                      <Switch
                        checked={settings.applicationAlerts}
                        onCheckedChange={(value) => handleSettingChange("applicationAlerts", value)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Document Expiry Warnings</p>
                        <p className="text-sm text-gray-600">Alerts when documents are about to expire</p>
                      </div>
                      <Switch
                        checked={settings.documentExpiry}
                        onCheckedChange={(value) => handleSettingChange("documentExpiry", value)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Marketing Communications</p>
                        <p className="text-sm text-gray-600">Tips, news, and feature updates</p>
                      </div>
                      <Switch
                        checked={settings.marketingEmails}
                        onCheckedChange={(value) => handleSettingChange("marketingEmails", value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Settings */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="size-5 text-blue-600" />
                  Privacy Controls
                </CardTitle>
                <CardDescription>Manage how your information is used and shared</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Profile Visibility</Label>
                  <Select value={settings.profileVisibility} onValueChange={(value) => handleSettingChange("profileVisibility", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">Private - Only visible to you</SelectItem>
                      <SelectItem value="limited">Limited - Visible to support team</SelectItem>
                      <SelectItem value="public">Public - Visible in community forums</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Data Sharing with Partners</p>
                    <p className="text-sm text-gray-600">
                      Share anonymized data to improve scheme recommendations
                    </p>
                  </div>
                  <Switch
                    checked={settings.dataSharing}
                    onCheckedChange={(value) => handleSettingChange("dataSharing", value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Analytics & Usage Data</p>
                    <p className="text-sm text-gray-600">
                      Help us improve by sharing anonymous usage statistics
                    </p>
                  </div>
                  <Switch
                    checked={settings.analyticsTracking}
                    onCheckedChange={(value) => handleSettingChange("analyticsTracking", value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Alert className="border-blue-200 bg-blue-50">
              <AlertCircle className="size-4 text-blue-600" />
              <AlertTitle className="text-blue-900">Your Privacy Matters</AlertTitle>
              <AlertDescription className="text-blue-800">
                We never sell your personal information. All data sharing is optional and anonymized.
                You have full control over your privacy settings. Read our{" "}
                <a href="#" className="underline font-medium">Privacy Policy</a> for details.
              </AlertDescription>
            </Alert>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="size-5 text-blue-600" />
                  Password & Authentication
                </CardTitle>
                <CardDescription>Manage your account security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium text-gray-900">Password</p>
                      <p className="text-sm text-gray-600">Last changed 45 days ago</p>
                    </div>
                    <Button variant="outline" onClick={() => setShowPasswordChange(true)}>
                      Change Password
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <p className="font-medium text-gray-900">Two-Factor Authentication (2FA)</p>
                    <p className="text-sm text-gray-600">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch
                    checked={settings.twoFactorAuth}
                    onCheckedChange={(value) => handleSettingChange("twoFactorAuth", value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Login Alerts</p>
                    <p className="text-sm text-gray-600">
                      Get notified when someone logs into your account
                    </p>
                  </div>
                  <Switch
                    checked={settings.loginAlerts}
                    onCheckedChange={(value) => handleSettingChange("loginAlerts", value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
                <CardDescription>Devices currently logged into your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 flex items-center gap-2">
                        <CheckCircle className="size-4 text-green-600" />
                        Windows PC • Chrome Browser
                      </p>
                      <p className="text-sm text-gray-600">Current session • Mumbai, India</p>
                    </div>
                    <span className="text-xs text-green-600 font-medium">Active Now</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Alert className="border-amber-200 bg-amber-50">
              <Shield className="size-4 text-amber-600" />
              <AlertTitle className="text-amber-900">Security Best Practices</AlertTitle>
              <AlertDescription className="text-amber-800">
                • Use a strong, unique password<br />
                • Enable two-factor authentication<br />
                • Never share your password with anyone<br />
                • Log out from shared devices<br />
                • Review active sessions regularly
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end gap-3 mt-8">
          <Button variant="outline" onClick={onBack}>
            Cancel
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <CheckCircle className="size-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Password Change Dialog */}
      <Dialog open={showPasswordChange} onOpenChange={setShowPasswordChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new strong password
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Current Password</Label>
              <div className="relative">
                <Input
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showCurrentPassword ? <EyeOff className="size-4 text-gray-400" /> : <Eye className="size-4 text-gray-400" />}
                </button>
              </div>
            </div>
            <div>
              <Label>New Password</Label>
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  {showNewPassword ? <EyeOff className="size-4 text-gray-400" /> : <Eye className="size-4 text-gray-400" />}
                </button>
              </div>
            </div>
            <div>
              <Label>Confirm New Password</Label>
              <Input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setShowPasswordChange(false)}>
              Cancel
            </Button>
            <Button onClick={handlePasswordChange} className="bg-blue-600 hover:bg-blue-700">
              Update Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. All your data, documents, and application history will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <Alert className="border-red-200 bg-red-50 mt-4">
            <AlertCircle className="size-4 text-red-600" />
            <AlertTitle className="text-red-900">Warning</AlertTitle>
            <AlertDescription className="text-red-800">
              You will lose access to:
              <ul className="list-disc list-inside mt-2">
                <li>All saved documents</li>
                <li>Application history</li>
                <li>Scheme recommendations</li>
                <li>Support tickets</li>
              </ul>
            </AlertDescription>
          </Alert>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleAccountDelete}>
              <Trash2 className="size-4 mr-2" />
              Delete My Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
