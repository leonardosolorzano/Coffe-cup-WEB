'use client';

import { CategoryType } from '@/types/category';
import { ResponseType } from '@/types/response';
import { useEffect, useState } from 'react'

const useGetCategories = (): ResponseType<CategoryType[]> => {
    const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/categories?populate=*`
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(url);
                const json = await res.json()
                setResult(json.data)
                setLoading(false)
            } catch (error: unknown) {
                setError(error instanceof Error ? error.message : String(error))
                setLoading(false)
            }
        })()
    }, [url])

    return { result, loading, error }
}

export default useGetCategories