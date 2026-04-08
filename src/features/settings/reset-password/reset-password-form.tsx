import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/use-auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowLeft, CheckCircle, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Password must contain uppercase, lowercase, number and special character",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

const UpdatePassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const { logout } = useAuthStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
  });

  const password = watch("password", "");

  // Password strength checker
  const getPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&]/.test(password)) score++;

    return score;
  };

  const passwordStrength = getPasswordStrength(password);
  const strengthColors = [
    "bg-red-500",
    "bg-red-400",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-green-500",
  ];
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];

  const onSubmit = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate random success/failure for demo
      if (Math.random() > 0.3) {
        setIsSuccess(true);
      } else {
        throw new Error("Failed to reset password. Please try again.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    logout();
    // In a real app, this would navigate back to login
    setIsSuccess(false);
    setError("");
  };

  if (isSuccess) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Password Reset Successfully
              </h2>
              <p className="text-gray-600 mt-2">
                Your password has been updated. You can now log in with your new
                password.
              </p>
            </div>
            <Button onClick={handleBackToLogin} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardContent>
        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your new password"
                {...register("password")}
                className={errors.password ? "border-red-500" : ""}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}

            {/* Password Strength Indicator */}
            {password && (
              <div className="space-y-2">
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-2 flex-1 rounded-full ${
                        level <= passwordStrength
                          ? strengthColors[passwordStrength - 1]
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <p
                  className={`text-sm ${
                    passwordStrength <= 2
                      ? "text-red-600"
                      : passwordStrength <= 3
                        ? "text-yellow-600"
                        : "text-green-600"
                  }`}
                >
                  Password strength:{" "}
                  {strengthLabels[passwordStrength - 1] || "Very Weak"}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your new password"
                {...register("confirmPassword")}
                className={errors.confirmPassword ? "border-red-500" : ""}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Password Requirements */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Password Requirements:
            </h4>
            <ul className="text-xs text-gray-600 space-y-1">
              <li
                className={`flex items-center ${password.length >= 8 ? "text-green-600" : ""}`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full mr-2 ${password.length >= 8 ? "bg-green-500" : "bg-gray-300"}`}
                />
                At least 8 characters
              </li>
              <li
                className={`flex items-center ${/[A-Z]/.test(password) ? "text-green-600" : ""}`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full mr-2 ${/[A-Z]/.test(password) ? "bg-green-500" : "bg-gray-300"}`}
                />
                One uppercase letter
              </li>
              <li
                className={`flex items-center ${/[a-z]/.test(password) ? "text-green-600" : ""}`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full mr-2 ${/[a-z]/.test(password) ? "bg-green-500" : "bg-gray-300"}`}
                />
                One lowercase letter
              </li>
              <li
                className={`flex items-center ${/\d/.test(password) ? "text-green-600" : ""}`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full mr-2 ${/\d/.test(password) ? "bg-green-500" : "bg-gray-300"}`}
                />
                One number
              </li>
              <li
                className={`flex items-center ${/[@$!%*?&]/.test(password) ? "text-green-600" : ""}`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full mr-2 ${/[@$!%*?&]/.test(password) ? "bg-green-500" : "bg-gray-300"}`}
                />
                One special character (@$!%*?&)
              </li>
            </ul>
          </div>

          <Button
            onClick={handleSubmit(onSubmit)}
            className="w-full"
            disabled={!isValid || isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Resetting Password...
              </>
            ) : (
              "Update Password"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpdatePassword;
