"use client"
import DeckList from '@/components/DeckList'
import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'


const Page = () => {
    const [query, setQuery] = useState('')
    return (
        <section className='px-20 py-20 flex flex-col items-center'>
            {/* Search bar */}
            <div className='relative w-full md:w-1/3 max-w-4xl'>
                <Search size={24} className='absolute left-3 top-3 text-gray-400' />
                <Input
                    value={query}
                    type='text'
                    placeholder='Search your forms'
                    className='w-full bg-transparent focus:outline-none pl-11 py-6 text-base rounded-md'
                    onChange={e => setQuery(e.target.value)}
                />
            </div>
            <DeckList query={query} />
        </section>
    )
}

export default Page