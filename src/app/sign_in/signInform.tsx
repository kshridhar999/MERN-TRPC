"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { signInSchema } from "~/input_types"
import { api } from "~/trpc/react"

export default function SignInForm() {
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)

    const authFunc = api.auth.signIn.useMutation({
        onSuccess: (data) => {
            if (!data?.isEmailVerified) {
                router.push('/verify_email')
            } else {
                router.push("/")
            }
        },
        onError: (err) => {
            console.log(err.message)
        }
    })

    const handleSignIn = (formData: FormData) => {
        const validated = signInSchema.safeParse(Object.fromEntries(formData.entries()))
        if (!validated.success) {
            console.log(validated.error.issues.join("\n"))
            return
        }
        authFunc.mutate(validated.data)
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
            <button className="mt-4 w-full bg-black text-white p-2 rounded-md hover:bg-gray-900 transition-colors" disabled={authFunc.isPending}>
                {!authFunc.isPending ? "Login" : "Logging In..."}
            </button>
            <line className='h-[0.5px] bg-[#c1c1c1] w-full' />
        </form >
    )
}