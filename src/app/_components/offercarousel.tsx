"use client"
import { useState } from "react"

const carouselItems = [
    "Get 10% off on business sign up 1",
    "Get 10% off on business sign up 2",
    "Get 10% off on business sign up 3",
]
export default function OfferCarousel() {
    const [activeItemIndex, setActiveItemIndex]= useState(0)
    return (
        <div className="flex justify-center items-center bg-[#f4f4f4]">
            <button className="p-2 mr-4" onClick={()=> setActiveItemIndex((pv)=> pv === 0 ? carouselItems.length - 1 : pv - 1)}>
                <img src="/lefticon.svg" alt="left icon" />
            </button>
            {
                carouselItems.map((item, index) => (
                    <div key={index} className={`${activeItemIndex === index ? "visible": "hidden"} text-sm w-1/4 text-center`}>
                        {item}
                    </div>
                ))
            }
            <button className="p-2 ml-4" onClick={()=> setActiveItemIndex((pv)=> (pv + 1)%carouselItems.length)}>
                <img src="/righticon.svg" alt="left icon" />
            </button>
        </div>
    )
}