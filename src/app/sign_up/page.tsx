import Link from "next/link";
import SignUpForm from "./signUpForm";

export default function SignUp() {
    return (
        <div className="flex grow items-center justify-center">
            <div className="flex w-1/3 flex-col items-center rounded-xl border-2  py-6">
                <div className="mb-4 text-2xl font-extrabold">Create new account</div>
                <SignUpForm></SignUpForm>

                <div className="font-light text-sm mt-8">Have an account? <span className="ml-2 font-medium hover:underline"><Link href="/sign_in">Login</Link></span></div>
            </div>
        </div>
    );
}
