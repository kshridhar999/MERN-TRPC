"use client"

import { useRouter } from "next/navigation"
import { signUpSchema } from "~/input_types"
import { api } from "~/trpc/react"

export default function SignUpForm() {
    const router = useRouter()

    const authFunc = api.auth.signUp.useMutation({
        onSuccess: (data) => {
            router.push(`/verify_email?id=${data.id}`)
        },
        onError: (err) => {
            console.log(err.message)
        }
    })

    const handleSignUp = (formData: FormData) => {
        const validated = signUpSchema.safeParse(Object.fromEntries(formData.entries()))
        if (!validated.success) {
            console.log(validated.error.issues.join("\n"))
            return
        }
        authFunc.mutate(validated.data)
    }

    return (
        <form className="flex flex-col gap-6 mt-8 w-2/3" action={handleSignUp}>
            <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm">
                    Name
                </label>
                <input
                    type="text"
                    name="name"
                    placeholder="Enter"
                    className="w-full px-4 py-2 text-black border-[1px] border-gray-200 rounded-md focus-visible:outline-none"
                />
            </div>
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
                <input
                    type="password"
                    name="password"
                    placeholder="Enter"
                    className="w-full px-4 py-2 text-black border-[1px] border-gray-200 rounded-md focus-visible:outline-none"
                />
            </div>
            <button className="mt-4 w-full bg-black text-white p-2 rounded-md hover:bg-gray-900 transition-colors" disabled={authFunc.isPending}>
                {!authFunc.isPending ? "Create Account" : "Creating Account..."}
            </button>
            <line className='h-[0.5px] bg-[#c1c1c1] w-full' />
        </form >
    )
}