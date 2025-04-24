import { AuthForm } from "@/components/forms/AuthForm";
import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <div className="mx-auto w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
      <AuthForm mode="login" />
      <p className="text-center mt-4">
        Don't have an account?{" "}
        <Link to="/register" className="text-blue-600">
          Register
        </Link>
      </p>
    </div>
  );
}
