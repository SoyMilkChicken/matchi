"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

const signupSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOTP] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    getValues,
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const email = watch("email", "");
  const isEduEmail = email.endsWith(".edu");

  const onSubmit = async (data: SignupForm) => {
    setIsLoading(true);
    try {
      const supabase = createClient();

      // Send OTP
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: data.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            name: data.name,
          },
        },
      });

      if (otpError) throw otpError;

      toast.success("Verification code sent to your email!");
      setShowOTP(true);
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();

      // Verify OTP
      const { data: authData, error: verifyError } = await supabase.auth.verifyOtp({
        email: getValues("email"),
        token: otp,
        type: "email",
      });

      if (verifyError) throw verifyError;

      // Create user profile
      if (authData.user) {
        const isEduEmail = getValues("email").endsWith(".edu");

        const { error: profileError } = await supabase
          .from("users")
          .insert({
            id: authData.user.id,
            email: getValues("email"),
            name: getValues("name"),
            is_edu_verified: isEduEmail,
            interests: [],
            looking_for: [],
          });

        if (profileError && profileError.code !== "23505") {
          // Ignore duplicate key error (user already exists)
          throw profileError;
        }
      }

      toast.success("Account created! Welcome to Matchi!");
      router.push("/events");
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("Invalid code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md border-none shadow-lg">
      <CardHeader className="text-center">
        <Link href="/">
          <h1 className="mb-2 text-3xl font-bold text-primary">Matchi</h1>
        </Link>
        <CardTitle className="text-xl">Create your account</CardTitle>
        <p className="text-sm text-muted-foreground">
          Join the community today
        </p>
      </CardHeader>
      <CardContent>
        {!showOTP ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register("email")}
                />
                {isEduEmail && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <BadgeCheck className="h-5 w-5 text-primary" />
                  </div>
                )}
              </div>
              {isEduEmail && (
                <p className="flex items-center gap-1 text-sm text-primary">
                  <BadgeCheck className="h-4 w-4" />
                  Student email detected! You&apos;ll get a verified badge.
                </p>
              )}
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-center text-sm text-muted-foreground">
              Enter the verification code sent to{" "}
              <span className="font-medium text-foreground">
                {getValues("email")}
              </span>
            </p>
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit code"
                value={otp}
                onChange={(e) => setOTP(e.target.value)}
                maxLength={6}
              />
            </div>
            <Button
              onClick={verifyOTP}
              className="w-full"
              disabled={isLoading || otp.length < 6}
            >
              {isLoading ? "Verifying..." : "Verify Code"}
            </Button>
            <Button
              variant="link"
              className="w-full"
              onClick={() => setShowOTP(false)}
            >
              Use a different email
            </Button>
          </div>
        )}

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link href="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>
      </CardContent>
    </Card>
  );
}
