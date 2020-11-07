import React from 'react'
import { Reserve } from '../../components'

export default function SwapToken(p:{value:string}){
    return <div role="tabpanel" hidden={p.value !== "swap"}>
        <Reserve/>
    </div>
}
