import Image from "next/image"
import Link from "next/link"

const navlinks = [
    { key: "categories", label: "Categories", href: "/categories" },
    { key: "sale", label: "Sale", href: "/sale" },
    { key: "clearance", label: "Clearance", href: "/clearance" },
    { key: "new_stock", label: "New Stock", href: "/new_stock" },
    { key: "trending", label: "Trending", href: "/trending" },
] as const

export default function Navbar() {
    return (
        <nav className="flex justify-between w-screen items-center p-2">
            <h1 className="uppercase shrink-0 font-extrabold text-3xl">Ecommerce</h1>
            <div className="flex gap-4 items-center font-semibold">
                {
                    navlinks.map((link) => (
                        <Link href={link.href} key={link.key}>
                            {link.label}
                        </Link>
                    ))
                }

            </div>
            <div className="flex gap-4 shrink-0">

                <img src="/searchicon.svg" alt="search icon" />
                <img src="/carticon.svg" alt="cart icon" />
            </div>
        </nav>
    )
}