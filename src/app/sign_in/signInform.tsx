"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { useFormStatus } from "react-dom"
import { signInSchema } from "~/input_types"
import onSignIn from "./handleSignIn"
import Button from "../_components/button"

const SignInButton = () => {
    const { pending } = useFormStatus()
    return (
        <Button className="mt-4 w-full bg-secondary-dark text-white p-2 rounded-md hover:bg-secondary-dark-hover" disabled={pending}>
            {!pending ? "Login" : "Logging In..."}
        </Button>
    )
}
export default function SignInForm() {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)

    const handleSignIn = async (formData: FormData) => {
        const validated = signInSchema.safeParse(Object.fromEntries(formData.entries()))
        if (!validated.success) {
            console.log(validated.error.issues.join("\n"))
            return
        }
        const res = await onSignIn(formData)

        if (res.isEmailVerified) {
            router.push('/')
        } else {
            router.push(`/verify_email?id=${res.id}`)
        }
    }

    return (
        <form className="flex flex-col gap-6 mt-8 w-2/3" action={handleSignIn}>
            <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm">
                    Email
                </label>
                <input
                    type="email"
                    name="email"
                    placeholder="Enter"
                    className="w-full px-4 py-2 text-black border-[1px] border-gray-200 rounded-md focus-visible:outline-none"
                />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-sm">
                    Password
                </label>
                <div className="w-full border-[1px] border-gray-200 rounded-md truncate relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Enter"
                        className="px-4 py-2 text-black focus-visible:outline-none"
                    />
                    <button className="underline p-2 absolute right-0 top-0 bottom-0" type="button" onClick={() => { setShowPassword(!showPassword) }}>
                        {!showPassword ? "Show" : "Hide"}
                    </button>
                </div>
            </div>
            <SignInButton></SignInButton>
            <line className='h-[0.5px] bg-[#c1c1c1] w-full' />
        </form >
    )
}