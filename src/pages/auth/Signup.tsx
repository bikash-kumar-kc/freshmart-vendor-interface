import { toast } from "@/components/ui/toast";
import { useAuthContext } from "@/context/AuthContext";
import useSignup from "@/lib/tanstackquery/queryHook/useSignup";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import z from "zod";

const schemaForRegister = z
  .object({
    email: z.string().email("Please enter a valid email addresss"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"],
  });

export type ISignupTypes = z.infer<typeof schemaForRegister>;

const Signup = () => {
  const navigate = useNavigate();
  const { refetchUser } = useAuthContext();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const {
    mutateAsync: vendorCreateAccount,
    data: response,
    isPending: loading,
  } = useSignup();

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(schemaForRegister),
  });

  const handleSubmitHandler = async (data: ISignupTypes) => {
    try {
      await vendorCreateAccount({
        email: data.email,
        password: data.password,
        isVendor: true,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("Failed to create user ! msg: ", error.message);
        toast.add({
          type: "error",
          title: "Error",
          description: error.message,
        });
        return;
      }
      console.log(error);
    }
  };

  useEffect(() => {
    if (response) {
      refetchUser(response);
      reset();
      navigate("/dashboard");
    }
  }, [response, navigate, refetchUser, reset]);

  return (
    <>
      <div className="w-full flex flex-col justify-center lg:items-center min-h-screen px-8 sm:px-12 bg-amber-50 shadow-lg">
        <div className=" w-full md:w-[40%]  rounded-lg shadow-lg p-8">
          <div className="mb-10 flex flex-col items-center w-full">
            <Link to={"/"}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">🌿</span>
                <span className="text-lg font-bold text-green-700 tracking-wider">
                  FRESHMART
                </span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm">Create your account</p>
          </div>

          <form
            onSubmit={handleSubmit(handleSubmitHandler)}
            className="flex flex-col gap-5 "
          >
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="text"
                id="email"
                placeholder="Enter your email..."
                {...register("email")}
                autoComplete={"off"}
                className="w-full border border-gray-200 rounded-sm px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-300 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
              {errors.email?.message && (
                <p className="text-red-500 text-xs">{errors.email.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </label>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password..."
                  {...register("password")}
                  className="w-full border border-gray-200 rounded-sm px-3.5 py-2.5 pr-11 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition placeholder:text-gray-300"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) =>
                      getValues("password").trim() ? !prev : prev,
                    )
                  }
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errors.password?.message && (
                <p className="text-red-500 text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
              </div>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="Confirm your password"
                  {...register("confirmPassword")}
                  autoComplete={"off"}
                  className="w-full border border-gray-200 rounded-sm px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition placeholder:text-gray-300"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((prev) =>
                      getValues("confirmPassword").trim() ? !prev : prev,
                    )
                  }
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              {errors.confirmPassword?.message && (
                <p className="text-red-500 text-xs">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-sm font-semibold py-2.5 rounded-sm transition-colors duration-200 mt-1"
            >
              {loading ? "loading..." : " Create Account"}
            </button>
          </form>

          <p className="text-gray-500 text-sm mt-6 text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-green-600 hover:text-green-700 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Signup;
