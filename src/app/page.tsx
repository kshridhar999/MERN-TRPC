import { redirect } from "next/navigation";
import { api } from "~/trpc/server";


export default async function Home() {
  const res = await api.user.isAuthorized()
  if(!res.isAuthorized){
    redirect("/sign_in")
  }
  return (
    <main>
      
    </main>
  );
}


