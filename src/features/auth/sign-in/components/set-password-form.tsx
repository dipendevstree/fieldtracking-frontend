import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/stores/use-auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@tanstack/react-router";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useSetPassword } from "../services/sign-in-services";

const setPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        "Must include uppercase, lowercase, number, and special character",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SetPasswordValues = z.infer<typeof setPasswordSchema>;

export function SetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const { setIsPasswordChanged } = useAuthStore();

  const { navigate } = useRouter();

  const { mutate: setPassword, isPending: isLoading } = useSetPassword(() => {
    setIsPasswordChanged(true);
    navigate({ to: "/" });
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<SetPasswordValues>({
    resolver: zodResolver(setPasswordSchema),
    mode: "onChange",
  });

  const password = watch("password", "");

  const onSubmit = (data: SetPasswordValues) => {
    setError("");
    setPassword({ new_password: data.password });
  };

  const getPasswordStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[@$!%*?&]/.test(pwd)) score++;
    return score;
  };

  const strength = getPasswordStrength(password);
  const strengthColors = [
    "bg-red-500",
    "bg-orange-400",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-green-500",
  ];
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];

  return (
    <Card className="w-full max-w-md">
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
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
                className={`pr-10 ${errors.password ? "border-red-500" : ""}`}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
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

            {password && (
              <div className="space-y-2">
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-2 flex-1 rounded-full ${
                        level <= strength
                          ? strengthColors[strength - 1]
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <p
                  className={`text-sm ${
                    strength <= 2
                      ? "text-red-600"
                      : strength <= 3
                        ? "text-yellow-600"
                        : "text-green-600"
                  }`}
                >
                  Password strength:{" "}
                  {strengthLabels[strength - 1] || "Very Weak"}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your new password"
                {...register("confirmPassword")}
                className={`pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
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
            type="submit"
            className="w-full"
            disabled={!isValid || isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Setting Password...
              </>
            ) : (
              "Set Password"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
