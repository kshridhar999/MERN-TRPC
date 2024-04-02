import Image from "next/image"
import Link from "next/link"
import Button from "./button"
import { api } from "~/trpc/server"

const navlinks = [
    { key: "categories", label: "Categories", href: "/categories" },
    { key: "sale", label: "Sale", href: "/sale" },
    { key: "clearance", label: "Clearance", href: "/clearance" },
    { key: "new_stock", label: "New Stock", href: "/new_stock" },
    { key: "trending", label: "Trending", href: "/trending" },
] as const

export default async function Navbar() {
    const session = await api.user.getUser()


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
                    session.user?.name && <div className="text-xs font-light">
                        Hi, {session.user.name}
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