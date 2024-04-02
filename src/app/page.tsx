import { redirect } from "next/navigation";
import { api } from "~/trpc/server";
import InterestList from "./interestList";


export default async function Home() {
  const res = await api.user.isAuthorized()
  if (!res.isAuthorized) {
    redirect("/sign_in")
  }

  const initialInterestList = await api.interest.getAllInterests({})

  return (
    <div className="flex grow items-center justify-center">
      <div className="flex w-1/3 flex-col items-center rounded-xl border-2  py-6 justify-between">
        <div className="mb-2 text-2xl font-extrabold">Please mark your interests!</div>
        <div className="text-sm">We will keep you notified.</div>
        <InterestList initialList={initialInterestList} />
      </div>
    </div>
  );
}


