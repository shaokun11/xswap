import React, { FC, useEffect, useMemo, useRef, useState } from 'react'
import Box from '@material-ui/core/Box'
import useTheme from '@material-ui/core/styles/useTheme'
import Button from '@material-ui/core/Button'
import { PhoneColorRadios, PhoneTypeRadios } from './components'
import { XSelect } from '../../components'
import MenuItem from '@material-ui/core/MenuItem'
import { useWeb3React } from '@web3-react/core'
import { useDispatch } from 'react-redux'
import { create2Action, useCreate2 } from '../../state/create2'
import { useInterval } from 'react-use'
import { Icon, IconButton, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import List from '@material-ui/core/List'
import IconPalette from '@material-ui/icons/Palette'
import IconHome from '@material-ui/icons/Home'
import IconSdStorage from '@material-ui/icons/SdStorage'
import IconFlashOn from '@material-ui/icons/FlashOn'
import IconCreditCard from '@material-ui/icons/CreditCard'
import IconHourglassEmpty from '@material-ui/icons/HourglassEmpty'
import IconEmojiPeople from '@material-ui/icons/EmojiPeople'

function AppleInfoItem(
    props: { Icon: React.ElementType; text: string | number } & React.PropsWithChildren<any>
) {
    const { Icon, text, ...other } = props
    return (
        <ListItem {...other}>
            <ListItemIcon>
                <Icon />
            </ListItemIcon>
            <ListItemText primary={text} />
        </ListItem>
    )
}

export default function Create2(p: { value: string }) {
    const theme = useTheme()
    const web3 = useWeb3React()
    const create2State = useCreate2()
    const [mkAppInfo, setMKApple] = useState({
        c: 'red',
        m: 8,
        d: 256,
    })
    const dispatch = useDispatch()
    const [selApple, updateSelApple] = useState(0)
    let selectAppInfo = create2State.cacheAppInfo.find(
        item => item.contract === create2State.appleAddress[selApple]
    )
    useInterval(() => {
        if (web3.library) {
            dispatch(create2Action.getApples())
        }
    }, 5000)

    const cachedAppleInfo = (contract: string) =>
        create2State.cacheAppInfo.some(item => item.contract === contract)

    useEffect(() => {
        create2State.apples > 0 &&
            dispatch(create2Action.getAppleContract({ start: 0, end: create2State.apples }))
    }, [create2State.apples, dispatch])
    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        let v = event.target.value as string
        updateSelApple(+v)
        !cachedAppleInfo(create2State.appleAddress[+v]) &&
            dispatch(create2Action.getAppleInfo(create2State.appleAddress[+v]))
    }
    const handleMKAppleInfo = (k: string) => (v: any) => {
        setMKApple(i => ({ ...i, [k]: v }))
    }
    const handleMKApple = () => {
        dispatch(
            create2Action.makeApple({
                color: mkAppInfo.c,
                memory: mkAppInfo.m,
                disk: mkAppInfo.d,
            })
        )
    }
    useEffect(() => {
        const isCached = cachedAppleInfo(create2State.appleAddress[0])
        create2State.appleAddress[0] &&
            !isCached &&
            dispatch(create2Action.getAppleInfo(create2State.appleAddress[0]))
    }, [web3.library, create2State.appleAddress[0]])

    const renderApples = useMemo(
        () => (
            <XSelect value={selApple} onChange={handleChange}>
                {create2State.appleAddress.map((item, index) => {
                    return (
                        <MenuItem key={index} value={index}>
                            {item.slice(0, 6) + '*******' + item.slice(-6)}
                        </MenuItem>
                    )
                })}
            </XSelect>
        ),
        [create2State.appleAddress, selApple]
    )
    return (
        <div role="tabpanel" style={{ height: '90%' }} hidden={p.value !== 'create2'}>
            <Box display={'flex'} style={{ height: '100%' }}>
                <Box
                    width={240}
                    border={1}
                    m={1}
                    mr={0.5}
                    //@ts-ignore
                    borderColor={theme.palette.indicator}
                    borderRadius={10}
                >
                    <Box>coming soon</Box>
                </Box>
                <Box
                    m={1}
                    ml={0.5}
                    width={'100%'}
                    display={'flex'}
                    flexDirection={'column'}
                    //@ts-ignore
                    borderColor={theme.palette.indicator}
                    border={1}
                    borderRadius={10}
                >
                    <Box height={'55%'}>
                        <Box>
                            {renderApples}
                            <span style={{ marginLeft: '40px' }}>allApples: {create2State.apples}</span>
                        </Box>
                        <AppleInfoItem
                            style={{ width: '100%' }}
                            Icon={IconHome}
                            text={selectAppInfo?.contract ?? '0x'}
                        />
                        <Box display={'flex'}>
                            <AppleInfoItem Icon={IconCreditCard} text={selectAppInfo?.id ?? '-'} />
                            <AppleInfoItem Icon={IconPalette} text={selectAppInfo?.color ?? '-'} />
                            <AppleInfoItem Icon={IconHourglassEmpty} text={selectAppInfo?.count ?? '-'} />
                        </Box>
                        <Box display={'flex'}>
                            <AppleInfoItem Icon={IconSdStorage} text={selectAppInfo?.disk ?? '-'} />
                            <AppleInfoItem Icon={IconFlashOn} text={selectAppInfo?.memory ?? '-'} />
                        </Box>
                        <Box>
                            <AppleInfoItem Icon={IconEmojiPeople} text={selectAppInfo?.player ?? '-'} />
                        </Box>
                    </Box>
                    <Box
                        height={'45%'}
                        display={'flex'}
                        flexDirection={'column'}
                        justifyContent={'space-around'}
                    >
                        <PhoneColorRadios
                            list={['red', 'blue', 'green', 'yellow']}
                            onChange={handleMKAppleInfo('c')}
                        />
                        <PhoneTypeRadios
                            list={['2', '3', '4']}
                            title={'Memory'}
                            onChange={handleMKAppleInfo('m')}
                        />
                        <PhoneTypeRadios
                            list={['64', '128', '256', '512']}
                            title={'Disk'}
                            onChange={handleMKAppleInfo('d')}
                        />
                        <Box textAlign={'center'}>
                            <Button variant={'outlined'} onClick={handleMKApple}>
                                Make Phone
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </div>
    )
}
