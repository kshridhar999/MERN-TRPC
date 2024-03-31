"use client"
import { useSearchParams } from "next/navigation";
import VerifyEmailForm from "./verifyEmailForm";
import { api } from "~/trpc/react";

export default function VerifyEmail() {
    const sParams = useSearchParams()
    const userId = sParams.get("id")
    if (!userId) {
        return
    }

    const userFunc = api.user.getUserLead.useQuery({
        id: userId,
    })

    return (
        <div className="flex grow items-center justify-center">
            <div className="flex w-1/3 flex-col items-center rounded-xl border-2  py-6">
                <div className="mb-4 text-2xl font-extrabold">Verify your email</div>
                <div className="text-sm">
                    Enter the 8 digit code you have received on
                    <span className="font-medium"> {userFunc.data?.email ?? "..."}</span>
                </div>

                <VerifyEmailForm id={userFunc.data?.id}></VerifyEmailForm>
            </div>
        </div>
    );
}
