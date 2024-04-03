import Link from "next/link"
import { type appRouter } from "~/server/api/root"
import { api } from "~/trpc/server"
import Button from "./button"

const navlinks = [
    { key: "categories", label: "Categories", href: "" },
    { key: "sale", label: "Sale", href: "" },
    { key: "clearance", label: "Clearance", href: "" },
    { key: "new_stock", label: "New Stock", href: "" },
    { key: "trending", label: "Trending", href: "" },
] as const

type User = Awaited<ReturnType<typeof appRouter["user"]["getUser"]>>

export default async function Navbar() {
    const session = await api.user.isAuthorized()

    let sessionUser: User = { user: null }
    if (session.isAuthorized) {
        sessionUser = await api.user.getUser()
    }
    return (
        <nav>
            <div className="flex justify-end gap-x-2 mt-2 pr-4">
                <Link href="" className="hover:underline decoration-secondary-hover underline-offset-4 text-xs font-light">
                    Help
                </Link>
                <Link href="" className="hover:underline decoration-secondary-hover underline-offset-4 text-xs font-light">
                    Orders & Returns
                </Link>
                {
                    sessionUser.user?.name && <div className="text-xs font-light">
                        Hi, {sessionUser.user.name}
                    </div>
                }

            </div>
            <div className="flex justify-between w-screen items-center p-2">
                <h1 className="uppercase flex-1 shrink-0 font-extrabold text-3xl">Ecommerce</h1>
                <div className="flex grow gap-4 justify-center items-center font-semibold">
                    {
                        navlinks.map((link) => (
                            <Link href={link.href} key={link.key} className="hover:underline decoration-secondary-hover underline-offset-4">
                                {link.label}
                            </Link>
                        ))
                    }

                </div>
                <div className="flex flex-1 gap-4 shrink-0 justify-end">
                    <Button variant="ghosted" size="icon">
                        <img src="/searchicon.svg" alt="search icon" />
                    </Button>
                    <Button variant="ghosted" size="icon">
                        <img src="/carticon.svg" alt="cart icon" />
                    </Button>
                </div>
            </div>
        </nav>
    )
}