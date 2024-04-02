"use client"

import { useRouter } from "next/navigation"
import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from "react"
import { useFormStatus } from "react-dom"
import { verifyEmailSchema } from "~/input_types"
import onVerify from "./handleVerify"
import Button from "../_components/button"

const VerifyButton = () => {
    const { pending } = useFormStatus()
    return (
        <Button className="mt-4 w-full bg-secondary-dark text-white hover:bg-secondary-dark-hover" disabled={pending}>
            {!pending ? "Verify" : "Verifying..."}
        </Button>
    )
}
let currentCodeIndex = 0
export default function VerifyEmailForm({ id }: { id: string }) {
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

    const handleSignUp = async (formData: FormData) => {
        const formValueObj = Object.fromEntries(formData.entries()) as { id: string, token: string }
        formValueObj.token = verfCode.join('')

        const validated = verifyEmailSchema.safeParse(formValueObj)
        if (!validated.success) {
            console.log(validated.error.issues.flatMap(e => e.path[0] + ": " + e.message))
            return
        }

        const res = await onVerify(validated.data)

        if (res.isEmailVerified) {
            router.push('/')
        }
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
                    {verfCode.map((_, index: number) => (
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
            <VerifyButton></VerifyButton>
        </form >
    )
}