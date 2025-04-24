import { AuthForm } from "@/components/forms/AuthForm";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  return (
    <div className="mx-auto w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
      <AuthForm mode="register" />
      <p className="text-center mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600">
          Login
        </Link>
      </p>
    </div>
  );
}
