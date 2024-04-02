"use client"
import { useState } from "react"
import Button from "./button"

const carouselItems = [
    "Get 10% off on business sign up 1",
    "Get 10% off on business sign up 2",
    "Get 10% off on business sign up 3",
]
export default function OfferCarousel() {
    const [activeItemIndex, setActiveItemIndex] = useState(0)
    return (
        <div className="flex justify-center items-center bg-[#f4f4f4]">
            <Button size="icon" variant="ghosted" onClick={() => setActiveItemIndex((pv) => pv === 0 ? carouselItems.length - 1 : pv - 1)}>
                <img src="/lefticon.svg" alt="left icon" />
            </Button>
            {
                carouselItems.map((item, index) => (
                    <div key={index} className={`${activeItemIndex === index ? "visible" : "hidden"} text-sm w-1/5 text-center`}>
                        {item}
                    </div>
                ))
            }
            <Button size="icon" variant="ghosted" onClick={() => setActiveItemIndex((pv) => (pv + 1) % carouselItems.length)}>
                <img src="/righticon.svg" alt="left icon" />
            </Button>
        </div>
    )
}