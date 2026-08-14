import { showToast } from "@/components/ReactToast";
import { useAuthContext } from "@/context/AuthContext";
import useSignin from "@/lib/tanstackquery/queryHook/useSignIn";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import z from "zod";

const schemaForSession = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export type ILoginType = z.infer<typeof schemaForSession>;

const Login = () => {
  const navigate = useNavigate();

  const { refetchUser } = useAuthContext();

  const [showPassword, setShowPassword] = useState(false);

  const {
    mutateAsync: vendorLogin,
    data: response,
    isPending: loading,
  } = useSignin();

  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(schemaForSession),
  });

  const handleSubmitHandler = async (data: ILoginType) => {
    try {
      await vendorLogin(data);
      showToast.success("LogIn Successfully");
    } catch {
      showToast.error("Failed to LogIn");
    }
  };

  useEffect(() => {
    if (response) {
      refetchUser(response.user);
      reset();
      navigate("/dashboard");
    }
  }, [response, navigate, refetchUser]);

  return (
    <>
      <div className="w-full  flex flex-col justify-center items-center shadow-lg min-h-screen px-8 sm:px-12 bg-amber-50">
        <div className=" w-full md:w-[40%]  rounded-lg shadow-lg p-8 ">
          <div className="mb-10 flex flex-col items-center">
            <Link to={"/"}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">🌿</span>
                <span className="text-lg font-bold text-green-700 tracking-wider">
                  FRESHMART
                </span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm">Sign in to your account</p>
          </div>

          <form
            onSubmit={handleSubmit(handleSubmitHandler)}
            className="flex flex-col gap-5 w-full"
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
                className="w-full border border-gray-200 rounded-sm px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition placeholder:text-gray-400"
              />
              {errors.email?.message && (
                <p className="text-red-500 text-xs text-center">
                  {errors.email.message}
                </p>
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
                <Link
                  to="/forgot-password"
                  className="text-xs text-green-600 hover:text-green-700 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password..."
                  {...register("password")}
                  className="w-full border border-gray-200 rounded-sm px-3.5 py-2.5 pr-11 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition placeholder:text-gray-400"
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

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-sm font-semibold py-2.5 rounded-sm transition-colors duration-200 mt-1"
            >
              {loading ? "loading..." : "Sign in"}
            </button>
          </form>

          <p className="text-gray-500 text-sm mt-6 text-center">
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="text-green-600 hover:text-green-700 font-medium transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
