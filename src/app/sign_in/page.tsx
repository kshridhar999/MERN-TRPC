import Link from "next/link";
import SignInForm from "./signInform";

export default function SignIn() {
  return (
    <div className="flex grow items-center justify-center">
      <div className="flex w-1/3 flex-col items-center rounded-xl border-2  py-6">
        <div className="mb-4 text-2xl font-extrabold">Login</div>
        <div className="text-xl font-normal">Welcome back to ECOMMERCE</div>
        <div className="text-sm">The next gen business marketplace</div>
        <SignInForm></SignInForm>

        <div className="font-light text-sm mt-8">Don{`'`}t have an account? <span className="ml-2 font-medium"><Link href="/sign_up">Sign Up</Link></span></div>
      </div>
    </div>
  );
}
