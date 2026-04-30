"use client";
import { getUserDetailsAction } from "@/lib/actions/auth-server-action";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { format } from "date-fns";
import { Calendar, Check, Mail, Phone, Shield, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export const ProfilePage = () => {
  const { data } = useQuery({
    queryKey: ["user-details"],
    queryFn: getUserDetailsAction,
    staleTime: 1000 * 5 * 60,
    retry: 1,
  });
  console.log(data?.createdAt);
  const [isEditing, setIsEditing] = useState(false);
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            User Profile
          </h1>
          <p className="text-muted-foreground">
            Manage and view your account information
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
          {/* Profile Header Section */}
          <div className="bg-gradient-to-r from-primary to-accent p-8 text-card">
            <div className="flex items-end gap-6">
              <div className="relative">
                <Image
                  src={data?.image || "https://github.com/shadcn.png"}
                  alt={data?.name || ""}
                  className="w-24 h-24 rounded-full border-4 border-card object-cover"
                  height={400}
                  width={400}
                />
                {data?.emailVerified && (
                  <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-2 border-2 border-card">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <div className="text-card">
                <h2 className="text-3xl font-bold">{data?.name}</h2>
                <p className="opacity-90">{data?.email}</p>
              </div>
              <div className="ml-auto">
                <Button
                  //   onClick={() => setIsEditing(!isEditing)}
                  //   variant={isEditing ? 'destructive' : 'secondary'}
                  className="font-semibold"
                >
                  {/* {isEditing ? 'Cancel' : 'Edit Profile'} */}
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Main Information */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-muted-foreground mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <Input
                      name="name"
                      className="bg-secondary border-border"
                      placeholder="Full name"
                    />
                  ) : (
                    <p className="text-lg text-foreground">{data?.name}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </label>
                  {isEditing ? (
                    <Input
                      name="email"
                      type="email"
                      className="bg-secondary border-border"
                      placeholder="Email address"
                    />
                  ) : (
                    <p className="text-lg text-foreground">{data?.email}</p>
                  )}
                  {data?.emailVerified && (
                    <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Email verified
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-2">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </label>
                  {isEditing ? (
                    <Input
                      name="phone"
                      className="bg-secondary border-border"
                      placeholder="Phone number"
                    />
                  ) : (
                    <p className="text-lg text-foreground">{data?.phone}</p>
                  )}
                </div>
                <div>
                  <p>Stripe</p>
                  {data?.stripeVerified ? (
                    <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Stripe verified
                    </p>
                  ) : (
                    <p className="text-xs text-red-300 mt-2 flex items-center gap-1">
                      <X className="w-3 h-3" />
                      Stripe unverified
                    </p>
                  )}
                </div>
              </div>

              {/* Secondary Information */}
              <div className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-2">
                    <Shield className="w-4 h-4" />
                    User Role
                  </label>
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                    {data?.role}
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-2">
                    <Calendar className="w-4 h-4" />
                    Account Created
                  </label>
                  {data?.createdAt && (
                    <p className="text-lg text-foreground">
                      {format(data?.createdAt as Date, "MMMM dd, yyyy")}
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-2">
                    <Calendar className="w-4 h-4" />
                    Last Updated
                  </label>
                  {data?.updatedAt && (
                    <p className="text-lg text-foreground">
                      {format(data?.updatedAt as Date, "MMMM dd, yyyy")}
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2">User ID</p>
                  <p className="text-sm font-mono text-foreground">
                    {data?.id}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="mt-8 flex gap-3 pt-6 border-t border-border justify-end">
                <Button variant="outline" className="font-semibold">
                  Cancel
                </Button>
                <Button className="bg-primary text-primary-foreground font-semibold hover:bg-primary/90">
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Your profile information is securely stored and protected</p>
        </div>
      </div>
    </div>
  );
};
