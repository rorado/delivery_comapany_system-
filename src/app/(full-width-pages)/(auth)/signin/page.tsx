import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js Sign In | Admin Dashboard",
  description: "Sign-in page for the admin dashboard.",
};

export default function SignIn() {
  return <SignInForm />;
}
