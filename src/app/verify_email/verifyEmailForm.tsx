"use client"

import { useRouter } from "next/navigation"
import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from "react"
import { verifyEmailSchema } from "~/input_types"
import { api } from "~/trpc/react"

let currentCodeIndex = 0
export default function VerifyEmailForm({ id }: { id: string | undefined }) {
    const router = useRouter()
    const [verfCode, setVerfCode] = useState<(string | number)[]>(new Array(8).fill(""));
    const [currentFocusedIndex, setCurrentFocusedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleVerfCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.value) {
            setCurrentFocusedIndex(currentCodeIndex - 1)
        } else {
            setCurrentFocusedIndex(currentCodeIndex < verfCode.length - 1 ? currentCodeIndex + 1 : currentCodeIndex)
        }
        setVerfCode(
            verfCode.map((code, i) => i === currentCodeIndex ? e.target.value : code)
        );
    }

    const handlePressChange = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
        currentCodeIndex = index
        if (e.key === "Backspace") {
            setCurrentFocusedIndex(currentCodeIndex - 1)
        }
    }

    const authFunc = api.auth.verifyEmail.useMutation({
        onSuccess: () => {
            router.push("/")
        },
        onError: (err) => {
            console.log(err.message)
        }
    })

    const handleSignUp = (formData: FormData) => {
        const formValueObj = Object.fromEntries(formData.entries()) as { id: string, token: string }
        formValueObj.token = verfCode.join('')

        const validated = verifyEmailSchema.safeParse(formValueObj)
        if (!validated.success) {
            console.log(validated.error.issues.join("\n"))
            return
        }
        authFunc.mutate(validated.data)
    }

    useEffect(() => {
        inputRef.current?.focus()
    }, [currentFocusedIndex])
    return (
        <form className="flex flex-col gap-6 mt-8 w-4/5" action={handleSignUp}>
            <input
                type="hidden"
                name="userId"
                value={id}
            />

            <div className="flex flex-col gap-2">
                <label htmlFor="token" className="text-sm">
                    Code
                </label>
                <div className="flex justify-between">
                    {verfCode.map((value: string | number, index: number) => (
                        <input
                            key={`index-${index}`}
                            ref={index === currentFocusedIndex ? inputRef : null}
                            inputMode="numeric"
                            pattern="\d{1}"
                            maxLength={1}
                            type="text"
                            value={verfCode[index]}
                            className="size-10 border-2 rounded bg-transparent outline-none text-center font-semibold text-xl spin-button-none"
                            onChange={handleVerfCodeChange}
                            onKeyDown={(e) => handlePressChange(e, index)}
                        />
                    ))}
                </div>
            </div>
            <button className="mt-4 w-full bg-black text-white p-2 rounded-md hover:bg-gray-900 transition-colors" disabled={authFunc.isPending}>
                {!authFunc.isPending ? "Verify" : "Verifying..."}
            </button>
        </form >
    )
}