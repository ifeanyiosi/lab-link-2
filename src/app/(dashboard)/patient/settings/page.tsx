"use client";

import React, { useEffect, useState } from "react";
import { User, Lock, Bell, CreditCard, Shield, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { auth, db } from "@/firebase/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    address: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setProfileData({
              firstName: userDoc.data().firstName || "",
              lastName: userDoc.data().lastName || "",
              email: user.email || "",
              phone: userDoc.data().phone || "",
              gender: userDoc.data().gender || "",
              address: userDoc.data().address || "",
            });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleSaveProfile = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          phone: profileData.phone,
          gender: profileData.gender,
          address: profileData.address,
        },
        { merge: true }
      );

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const menuItems = [
    {
      icon: <User className="mr-3 h-5 w-5" />,
      label: "Profile",
      key: "profile",
    },
    {
      icon: <Lock className="mr-3 h-5 w-5" />,
      label: "Security",
      key: "security",
    },
    {
      icon: <Bell className="mr-3 h-5 w-5" />,
      label: "Notifications",
      key: "notifications",
    },
    {
      icon: <CreditCard className="mr-3 h-5 w-5" />,
      label: "Billing",
      key: "billing",
    },
    {
      icon: <Shield className="mr-3 h-5 w-5" />,
      label: "Privacy",
      key: "privacy",
    },
    {
      icon: <HelpCircle className="mr-3 h-5 w-5" />,
      label: "Help",
      key: "help",
    },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return (
          <div className="space-y-6">       

            <div className="grid md:grid-cols-2 gap-4 w-full">
              <div>
                <Label>First Name</Label>
                <Input
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleInputChange}
                  placeholder="John"
                />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleInputChange}
                  placeholder="Doe"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  value={profileData.email}
                  disabled
                  placeholder="john.doe@example.com"
                />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              <div>
                <Label>Gender</Label>
                <select
                  name="gender"
                  value={profileData.gender}
                  onChange={handleInputChange}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
              <div>
                <Label>Address</Label>
                <Input
                  name="address"
                  value={profileData.address}
                  onChange={handleInputChange}
                  placeholder="Enter your address"
                />
              </div>
            </div>
            <Button
              onClick={handleSaveProfile}
              className="mt-4"
              disabled={loading}
            >
              {loading ? "Loading..." : "Save Changes"}
            </Button>
          </div>
        );
      case "security":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Change Password</h3>
              <div className="grid gap-4 mt-4">
                <div>
                  <Label>Current Password</Label>
                  <Input type="password" />
                </div>
                <div>
                  <Label>New Password</Label>
                  <Input type="password" />
                </div>
                <div>
                  <Label>Confirm New Password</Label>
                  <Input type="password" />
                </div>
                <Button>Update Password</Button>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold">
                Two-Factor Authentication
              </h3>
              <div className="flex justify-between items-center mt-4">
                <span>Enable two-factor authentication</span>
                <Switch />
              </div>
            </div>
          </div>
        );
      case "notifications":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span>Email Notifications</span>
              <Switch />
            </div>
            <div className="flex justify-between items-center">
              <span>SMS Notifications</span>
              <Switch />
            </div>
            <div className="flex justify-between items-center">
              <span>Push Notifications</span>
              <Switch />
            </div>
          </div>
        );
      default:
        return <div>Coming Soon</div>;
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Account Settings</h1>

      <div className="grid md:grid-cols-[250px_1fr] gap-8">
        {/* Sidebar Menu */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              {menuItems.map((item) => (
                <Button
                  key={item.key}
                  variant={activeSection === item.key ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection(item.key)}
                >
                  {item.icon}
                  {item.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content Area */}
        <Card>
          <CardHeader>
            <CardTitle>
              {menuItems.find((item) => item.key === activeSection)?.label}{" "}
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent>{renderSection()}</CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
