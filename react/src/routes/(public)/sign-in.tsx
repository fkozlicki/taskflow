import SignInForm from "@/components/sign-in-form.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { Link } from "react-router-dom";
import OAuthLinks from "@/components/oauth-links.tsx";

export default function SignIn() {
  return (
    <div className="flex p-4 h-screen gap-4">
      <div className="flex-1 relative bg-gradient-to-tr from-[#1e3c72] to-[#2a5298] rounded-2xl hidden lg:block">
        <div className="absolute p-8">
          <p className="text-white/50 mb-4">Join now and</p>
          <p className="text-4xl text-white font-medium">
            Boost your productivity <br /> with Taskflow
          </p>
        </div>
      </div>

      <div className="flex-1 grid place-items-center">
        <div className="max-w-md m-auto w-full">
          <h2 className="text-4xl capitalize mb-2">Welcome back</h2>
          <p className="text-muted-foreground mb-8">
            Please log in into your account to continue
          </p>
          <SignInForm />
          <p className="text-center my-4 text-sm">
            Don't have an account?
            <Link className="text-blue-600 hover:underline ml-2" to="/sign-up">
              Sign up
            </Link>
          </p>
          <Separator className="my-8" />

          <OAuthLinks />

          <Link
            to="/"
            className="hover:underline mt-4 text-center block text-sm"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
