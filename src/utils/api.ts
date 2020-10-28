import { ethers } from 'ethers'

const abi_test = [
    {
        'inputs': [
            {
                'internalType': 'address',
                'name': 'owner',
                'type': 'address',
            },
            {
                'internalType': 'uint256',
                'name': 'amount',
                'type': 'uint256',
            },
            {
                'internalType': 'uint8',
                'name': 'v',
                'type': 'uint8',
            },
            {
                'internalType': 'bytes32',
                'name': 'r',
                'type': 'bytes32',
            },
            {
                'internalType': 'bytes32',
                'name': 's',
                'type': 'bytes32',
            },
        ],
        'name': 'testEIP712',
        'outputs': [],
        'stateMutability': 'nonpayable',
        'type': 'function',
    },
    {
        'inputs': [],
        'stateMutability': 'nonpayable',
        'type': 'constructor',
    },
    {
        'inputs': [
            {
                'internalType': 'address',
                'name': '',
                'type': 'address',
            },
        ],
        'name': 'amounts',
        'outputs': [
            {
                'internalType': 'uint256',
                'name': '',
                'type': 'uint256',
            },
        ],
        'stateMutability': 'view',
        'type': 'function',
    },
    {
        'inputs': [],
        'name': 'DOMAIN_SEPARATOR',
        'outputs': [
            {
                'internalType': 'bytes32',
                'name': '',
                'type': 'bytes32',
            },
        ],
        'stateMutability': 'view',
        'type': 'function',
    },
    {
        'inputs': [
            {
                'internalType': 'address',
                'name': '',
                'type': 'address',
            },
        ],
        'name': 'nonces',
        'outputs': [
            {
                'internalType': 'uint256',
                'name': '',
                'type': 'uint256',
            },
        ],
        'stateMutability': 'view',
        'type': 'function',
    },
    {
        'inputs': [],
        'name': 'rc',
        'outputs': [
            {
                'internalType': 'address',
                'name': '',
                'type': 'address',
            },
        ],
        'stateMutability': 'view',
        'type': 'function',
    },
    {
        'inputs': [],
        'name': 'TEST_TYPEHASH',
        'outputs': [
            {
                'internalType': 'bytes32',
                'name': '',
                'type': 'bytes32',
            },
        ],
        'stateMutability': 'view',
        'type': 'function',
    },
]
const testContractAddress = '0x9F8C390b7048395d4DeBc7636031aD992115C303'
let testContractIns
export let provider :ethers.providers.Provider

export function getContractIns():ethers.Contract {
    return testContractIns
}

export function initTestContract(p: any,account:string) {
    provider = p
    const  ins = new ethers.Contract(testContractAddress, abi_test, provider)
    testContractIns = ins.connect(p.getSigner(account))
    return testContractIns
}

