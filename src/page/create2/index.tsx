import React, { Fragment, memo, useCallback, useEffect, useMemo, useState } from 'react'
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
import { Icon, IconButton, ListItem, ListItemIcon, ListItemText, StepButton, StepIcon, StepIconProps } from '@material-ui/core'
import IconPalette from '@material-ui/icons/Palette'
import IconHome from '@material-ui/icons/Home'
import IconSdStorage from '@material-ui/icons/SdStorage'
import IconFlashOn from '@material-ui/icons/FlashOn'
import IconFavoriteBorder from '@material-ui/icons/FavoriteBorder'
import IconCreditCard from '@material-ui/icons/CreditCard'
import IconHourglassEmpty from '@material-ui/icons/HourglassEmpty'
import IconEmojiPeople from '@material-ui/icons/EmojiPeople'
import IconSkipPrevious from '@material-ui/icons/SkipPrevious'
import IconSkipNext from '@material-ui/icons/SkipNext'
import Stepper from '@material-ui/core/Stepper'
import StepLabel from '@material-ui/core/StepLabel'
import Step from '@material-ui/core/Step'
import StepContent from '@material-ui/core/StepContent'
import dayjs from 'dayjs'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { green } from '@material-ui/core/colors'

function AppleInfoItem(
    props: { Icon: React.ElementType; text: string | number } & React.PropsWithChildren<any>,
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

const useStyles = makeStyles({
    step: {
        color: 'green',
        '&$active': {
            color: 'green',
        },
    },
    active: {},
})

function AppleSteps({ contract }: { contract: string }) {
    const create2State = useCreate2()
    const classes = useStyles()
    const selectActions = create2State.actions[contract]
    const Steps = useMemo(
        () => (
            <Stepper orientation={'vertical'}>
                {selectActions
                    ?.map((item, index) => (
                        <Step key={index} active={true}>
                            <StepLabel
                                icon={<IconFavoriteBorder style={{ color: green[500] }} />}
                                StepIconProps={{
                                    classes: {
                                        root: classes.step,
                                        active: classes.active,
                                    },
                                }}>
                                {item.player.slice(0, 4).concat('****').concat(item.player.slice(-4))}
                            </StepLabel>
                            <StepContent>
                                <Box>{dayjs(item.time * 1000).format('YYYY:MM:DD/HH:mm')}</Box>
                                <Box> {item.from + '->' + item.to}</Box>

                            </StepContent>
                        </Step>
                    )).reverse()}
            </Stepper>
        ),
        [contract, create2State.actions],
    )
    return <Fragment>{Steps}</Fragment>
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
        item => item.contract === create2State.appleAddress[selApple],
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
            }),
        )
    }
    const handleNexProcess = () => {
        let contract = create2State.appleAddress[selApple]
        const selectActions = create2State.actions[contract]
        const lastAction = selectActions[selectActions.length - 1]
        dispatch(
            create2Action.processNexStep({
                contract,
                last: lastAction.to,
                current: lastAction.step,
            }),
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
        [create2State.appleAddress, selApple],
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
                    <Box height={'100%'} style={{ overflowY: 'auto' }}>
                        <AppleSteps contract={create2State.appleAddress[selApple]} />
                    </Box>
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
                        <Box display={'flex'}>
                            <AppleInfoItem
                                Icon={IconEmojiPeople}
                                text={
                                    selectAppInfo?.player
                                                 .slice(0, 12)
                                                 .concat('*****')
                                                 .concat(selectAppInfo?.player.slice(-12)) ?? '-'
                                }
                            />
                            <Button
                                disabled={
                                    !Boolean(
                                        create2State.appleAddress[selApple] &&
                                        create2State.txResult.every(item => item.result !== 0),
                                    )
                                }
                                variant={'outlined'}
                                size={'small'}
                                style={{ marginRight: '10px' }}
                                onClick={handleNexProcess}
                            >
                                Process
                            </Button>
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
                            list={['4', '8', '12']}
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
