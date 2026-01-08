"use client";
import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<"admin" | "delivery" | "client">(
    "admin"
  );
  const router = useRouter();

  // Demo credentials for testing
  const demoCredentials = {
    admin: {
      email: "admin@fastdeliver.com",
      password: "admin123",
    },
    delivery: {
      email: "delivery@fastdeliver.com",
      password: "delivery123",
    },
    client: {
      email: "client@fastdeliver.com",
      password: "client123",
    },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const credentials = demoCredentials[userType];

    // Simple authentication logic - in production, use proper auth
    if (email === credentials.email && password === credentials.password) {
      // Redirect based on user type
      if (userType === "admin") {
        router.push("/admin");
      } else if (userType === "delivery") {
        router.push("/delivery");
      } else if (userType === "client") {
        router.push("/client");
      }
    } else {
      alert(
        "Invalid email or password. Please check the credentials below the form."
      );
    }
  };

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Retour à l'accueil
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Se connecter
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Saisissez votre email et mot de passe pour vous connecter !
            </p>
          </div>

          {/* User Type Selection */}
          <div className="mb-6">
            <Label>Se connecter en tant que</Label>
            <div className="grid grid-cols-3 gap-3 mt-2">
              <button
                type="button"
                onClick={() => setUserType("admin")}
                className={`px-4 py-2 text-sm font-medium rounded-lg border transition ${
                  userType === "admin"
                    ? "bg-brand-500 text-white border-brand-500"
                    : "bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                }`}
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => setUserType("delivery")}
                className={`px-4 py-2 text-sm font-medium rounded-lg border transition ${
                  userType === "delivery"
                    ? "bg-brand-500 text-white border-brand-500"
                    : "bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                }`}
              >
                Livreur
              </button>
              <button
                type="button"
                onClick={() => setUserType("client")}
                className={`px-4 py-2 text-sm font-medium rounded-lg border transition ${
                  userType === "client"
                    ? "bg-brand-500 text-white border-brand-500"
                    : "bg-white text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
                }`}
              >
                Client
              </button>
            </div>
          </div>

          <div>
            {/* <divtimer */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input
                    placeholder="info@gmail.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label>
                    Mot de passe <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Entrez votre mot de passe"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Rester connecté
                    </span>
                  </div>
                  <Link
                    href="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
                <div>
                  <Button type="submit" className="w-full" size="sm">
                    Se connecter
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Vous n&apos;avez pas de compte ? {""}
                <Link
                  href="/inscription"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  S&apos;inscrire
                </Link>
              </p>
            </div>

            {/* Demo Credentials Info */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">
                Identifiants de démonstration pour test :
              </p>
              <div className="text-xs text-blue-800 dark:text-blue-400 space-y-1">
                <p>
                  <strong>Admin:</strong> admin@fastdeliver.com / admin123
                </p>
                <p>
                  <strong>Delivery:</strong> delivery@fastdeliver.com /
                  delivery123
                </p>
                <p>
                  <strong>Client:</strong> client@fastdeliver.com / client123
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
