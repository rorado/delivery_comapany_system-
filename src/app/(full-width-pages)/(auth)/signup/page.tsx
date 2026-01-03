import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js Sign Up | Admin Dashboard",
  description: "Sign-up page for the admin dashboard.",
  // other metadata
};

export default function SignUp() {
  return <SignUpForm />;
}
