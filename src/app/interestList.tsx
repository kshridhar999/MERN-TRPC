
"use client"

import { useState, type ChangeEvent, useEffect } from "react"
import { type appRouter } from "~/server/api/root"
import { api } from "~/trpc/react"
const paginationLimit = 6
const getPagesToShow = (totalPages: number, currentPage = 0): number[] => {
    const pagesToShow: number[] = []

    const firstPageToShow = currentPage >= 6 ? currentPage - 5 : 1
    const lastPageToShow = currentPage <= 6 ? 7 : currentPage + 1
    for (let i = firstPageToShow; i <= lastPageToShow; i++) {
        pagesToShow.push(i)
    }

    return pagesToShow
}

export default function InterestList({ initialList }: { initialList: Awaited<ReturnType<typeof appRouter["interest"]["getAllInterests"]>> }) {
    const initalTotalPages = Math.ceil(initialList.paginationData.total / paginationLimit)

    const [pagesToShow, setPagesToShow] = useState<number[]>(getPagesToShow(initalTotalPages))
    const [currentPage, setCurrentPage] = useState(0)

    const interestQuery = api.interest.getAllInterests.useQuery({
        pagination: {
            page: currentPage,
            limit: paginationLimit,
        }
    }, {
        initialData: initialList,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false
    })

    const toggleInterest = api.interest.toggleInterest.useMutation({
        onSettled: async () => {
            await interestQuery.refetch()
        }
    })


    const handleToggle = (e: ChangeEvent<HTMLInputElement>, interestId: string) => {
        if (e.target.checked) {
            toggleInterest.mutate({ interestId, isSaved: true })
        } else {
            toggleInterest.mutate({ interestId, isSaved: false })
        }
    }


    const interests = interestQuery.data.data
    const paginationData = interestQuery.data.paginationData

    const totalPages = Math.ceil(paginationData.total / paginationLimit)

    useEffect(() => {
        setPagesToShow(getPagesToShow(totalPages, currentPage))
    }, [currentPage])

    const ShowComponent = () => {
        if (interestQuery.isFetching) {
            return <ul className="flex flex-col gap-y-2 mt-4">
                {
                    Array(paginationLimit).fill("").map((_, index) => {
                        return <li key={index} className="flex gap-x-4 items-center">
                            <div
                                className="size-4 animate-pulse bg-gray-400 rounded-sm"
                            />
                            <div className="h-6 w-28 animate-pulse bg-gray-400 rounded-sm" />
                        </li>
                    }
                    )
                }
            </ul>
        }
        if (interests.length === 0) {
            return <div>No interests found.</div>
        }
        return (
            <ul className="flex flex-col gap-y-2 mt-4">
                {
                    interests.map((inter) => {
                        return <li key={inter.id} className="flex gap-x-4 items-center">
                            <input
                                type="checkbox"
                                className="size-4 accent-black"
                                id={inter.id}
                                checked={inter.isSaved}
                                onChange={(e) => {
                                    handleToggle(e, inter.id)
                                }}
                            />
                            <label htmlFor={inter.id}>{inter.name}</label>
                        </li>
                    }
                    )
                }
            </ul>
        )
    }
    return (
        <div className="w-full px-12 my-4">
            <div className="font-semibold">
                My saved interests!
            </div>

            <ShowComponent />

            <div className="flex items-center gap-2 mt-6">
                <button className="flex items-center" onClick={() => setCurrentPage(0)} disabled={currentPage === 0}>
                    <img src="/lefticon.svg" alt="jump left fast"></img>
                    <img src="/lefticon.svg" alt="jump left fast"></img>
                </button>
                <button onClick={() => setCurrentPage(currentPage != 0 ? currentPage - 1 : currentPage)} disabled={currentPage == 0} className="disabled:fill-gray-400 disabled:stroke-gray-400 disabled:text-gray-400">
                    <img src="/lefticon.svg" alt="jump left"></img>
                </button>

                <div className="flex gap-x-2 items-center">
                    {currentPage > 6 && <p>...</p>}
                    {pagesToShow.map((page, index) => {
                        return <button key={index} onClick={() => setCurrentPage(page)} className={`${page === currentPage + 1 ? "text-black" : "text-gray-400"}`}>{page}</button>
                    })}
                    {currentPage + 1 < totalPages && <p>...</p>}
                </div>
                <button onClick={() => setCurrentPage(currentPage != totalPages ? currentPage + 1 : currentPage)} disabled={currentPage == totalPages - 1}>
                    <img src="/righticon.svg" alt="jump right"></img>
                </button>
                <button className="flex items-center group" onClick={() => setCurrentPage(totalPages - 1)} disabled={currentPage === totalPages - 1}>
                    <img src="/righticon.svg" alt="jump right fast"></img>
                    <img src="/righticon.svg" alt="jump right fast"></img>
                </button>
            </div>
        </div>
    )
}