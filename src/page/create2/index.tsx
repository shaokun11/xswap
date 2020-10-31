import React, { useEffect, useMemo, useRef, useState } from 'react'
import Box from '@material-ui/core/Box'
import useTheme from '@material-ui/core/styles/useTheme'
import Button from '@material-ui/core/Button'
import { PhoneColorRadios, PhoneTypeRadios } from './components'
import { FormControl } from '@material-ui/core'
import { XSelect } from '../../components'
import MenuItem from '@material-ui/core/MenuItem'
import { useWeb3React } from '@web3-react/core'
import { useDispatch } from 'react-redux'
import { create2Action, useCreate2 } from '../../state/create2'
import { useInterval } from 'react-use'
import { Scrollbars } from 'react-custom-scrollbars'
import Select from '@material-ui/core/Select'

export default function Create2(p: { value: string }) {
    const theme = useTheme()
    const web3 = useWeb3React()
    const create2State = useCreate2()
    const dispatch = useDispatch()
    useInterval(() => {
        if (web3.library) {
            dispatch(create2Action.getApples())
        }
    }, 5000)

    useEffect(() => {
        create2State.apples > 0 && dispatch(create2Action.getAppleContract({ start: 0, end: create2State.apples }))
    }, [create2State.apples, dispatch])

    return (
        <div role="tabpanel" style={{ height: '90%' }} hidden={p.value !== 'create2'}>
            <Box display={'flex'} style={{ height: '100%' }}>
                <Box
                    flexGrow={3}
                    border={1}
                    m={1}
                    mr={0.5}
                    //@ts-ignore
                    borderColor={theme.palette.indicator}
                    borderRadius={10}
                >
                    coming soon
                </Box>
                <Box
                    flexGrow={1}
                    m={1}
                    ml={0.5}
                    display={'flex'}
                    flexDirection={'column'}
                    //@ts-ignore
                    borderColor={theme.palette.indicator}
                    border={1}
                    borderRadius={10}
                >
                    <Box height={'40%'}>
                        <XSelect>
                                <MenuItem onClick={() => {
                                    console.log('---click--')
                                }} value={0}>Principle</MenuItem>
                                <MenuItem value={1}>Sketch</MenuItem>
                                <MenuItem value={2}>Photoshop</MenuItem>
                                <MenuItem value={3}>Framer</MenuItem>
                                <MenuItem value={4}>Framer</MenuItem>
                                <MenuItem value={5}>Framer</MenuItem>
                                <MenuItem value={6}>Framer</MenuItem>
                                <MenuItem value={7}>Framer</MenuItem>
                        </XSelect>
                    </Box>
                    <Box height={'60%'} display={'flex'} flexDirection={'column'} justifyContent={'space-around'}>
                        <PhoneColorRadios list={['red', 'blue', 'green', 'yellow']} />
                        <PhoneTypeRadios list={['2', '3', '4']} title={'Memory'} />
                        <PhoneTypeRadios list={['64', '128', '256', '512']} title={'Disk'} />
                        <Box textAlign={'center'}>
                            <Button variant={'outlined'}>Make Phone</Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </div>
    )
}
