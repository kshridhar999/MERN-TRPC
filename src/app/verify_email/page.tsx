import { api } from "~/trpc/server";
import VerifyEmailForm from "./verifyEmailForm";

export default async function VerifyEmail({ searchParams }: { searchParams?: Record<string, string | undefined> }) {
    const userId = searchParams?.id
    const verfId = searchParams?.vid

    if (!(userId ?? verfId)) {
        return
    }

    const userFunc = await api.user.getUserLead({
        id: userId!,
        vid: verfId ?? undefined
    })

    return (
        <div className="flex grow items-center justify-center">
            <div className="flex w-1/3 flex-col items-center rounded-xl border-2  py-6">
                <div className="mb-4 text-2xl font-extrabold">Verify your email</div>
                <div className="text-sm">
                    Enter the 8 digit code you have received on
                    <span className="font-medium"> {userFunc.email}</span>
                </div>

                <VerifyEmailForm id={userFunc.id}></VerifyEmailForm>
            </div>
        </div>
    );
}
