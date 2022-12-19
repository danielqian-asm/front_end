import React, { useEffect } from 'react'
import Router from 'next/router'

export default function Home(): JSX.Element {
    useEffect(() => {
        Router.push('/index')
    }, [])
    return <></>
}