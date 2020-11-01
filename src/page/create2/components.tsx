import React, { useMemo } from 'react'
import { FormControlLabel, Radio } from '@material-ui/core'
import Box from '@material-ui/core/Box'
import { XRadio } from '../../components'
import { blue, green, red, yellow } from '@material-ui/core/colors'

export function PhoneTypeRadios({
    list,
    title,
    onChange,
}: {
    list: string[]
    title: string
    onChange?: (color: string | number) => void
}) {
    const [first, update] = React.useState(list[0])
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        update(event.target.value)
        onChange && onChange(event.target.value)
    }
    const items = useMemo(
        () =>
            list.map(item => (
                <FormControlLabel
                    key={item}
                    label={item + 'G'}
                    value={parseInt(item)}
                    control={<Radio onChange={handleChange} checked={first === item} color={'default'} />}
                />
            )),
        [first]
    )
    return (
        <Box display={'flex'} alignItems={'center'}>
            <span style={{ marginLeft: 10 }}>{title}: </span>{' '}
            <Box display={'inline-flex'} flexGrow={1} justifyContent={'space-around'}>
                {items}
            </Box>
        </Box>
    )
}

const phoneColors = [red, blue, green, yellow]

export function PhoneColorRadios({
    list,
    onChange,
}: {
    list: string[]
    onChange?: (color: string | number) => void
}) {
    const [selectedPhoneColor, setSelectedPhoneColor] = React.useState(list[0])
    const handleChangeColor = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedPhoneColor(event.target.value)
        onChange && onChange(event.target.value)
    }
    const phoneColor = useMemo(
        () =>
            list.map((item, index) => (
                <XRadio
                    checked={selectedPhoneColor === item}
                    key={index}
                    onChange={handleChangeColor}
                    value={item}
                    cc={phoneColors[index]}
                />
            )),
        [selectedPhoneColor]
    )

    return (
        <Box display={'flex'} alignItems={'center'}>
            <span style={{ marginLeft: 10 }}>Color: </span>{' '}
            <Box display={'inline-flex'} flexGrow={1} justifyContent={'space-around'}>
                {phoneColor}
            </Box>
        </Box>
    )
}
