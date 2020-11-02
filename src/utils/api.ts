import { ethers, Signer } from 'ethers'

const eip712ContractAddress = '0x9F8C390b7048395d4DeBc7636031aD992115C303'
const appleFactoryContractAddress = '0xDc74C08Ea43f925b17E980d60811A306C109A81C'
export let provider: ethers.providers.Provider
export let signer: Signer

export function getEip712(): ethers.Contract {
    return new ethers.Contract(eip712ContractAddress, abi_eip712, provider).connect(
        signer,
    )
}

export function getAppleFactory(): ethers.Contract {
    return new ethers.Contract(appleFactoryContractAddress, abi_apple_factory, provider).connect(
        signer,
    )
}

export function getApple(address: string): ethers.Contract {
    return new ethers.Contract(address, abi_apple, provider).connect(
        signer,
    )
}


export function initProvider(p: any, account: string) {
    provider = p
    signer = p.getSigner(account)
}

const abi_eip712 = [
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
            {
                internalType: 'uint8',
                name: 'v',
                type: 'uint8',
            },
            {
                internalType: 'bytes32',
                name: 'r',
                type: 'bytes32',
            },
            {
                internalType: 'bytes32',
                name: 's',
                type: 'bytes32',
            },
        ],
        name: 'testEIP712',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [],
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        name: 'amounts',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'DOMAIN_SEPARATOR',
        outputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        name: 'nonces',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'rc',
        outputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'TEST_TYPEHASH',
        outputs: [
            {
                internalType: 'bytes32',
                name: '',
                type: 'bytes32',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
]
const abi_apple_factory = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "maker",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_id",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_memory",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "_disk",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "_color",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "_apple",
                "type": "address"
            }
        ],
        "name": "AppleCreated",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_memory",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_disk",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_color",
                "type": "string"
            }
        ],
        "name": "makeApple",
        "outputs": [
            {
                "internalType": "address",
                "name": "apple",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "apples",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "checkApple",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_start",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_end",
                "type": "uint256"
            }
        ],
        "name": "getAllApples",
        "outputs": [
            {
                "internalType": "address[]",
                "name": "_apples",
                "type": "address[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "int256",
                "name": "_id",
                "type": "int256"
            },
            {
                "internalType": "uint256",
                "name": "_memory",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_disk",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_color",
                "type": "string"
            }
        ],
        "name": "getApple",
        "outputs": [
            {
                "internalType": "address",
                "name": "apple",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "hash",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalApple",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]
const abi_apple = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "_pre",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "newPlayer",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "time",
                "type": "uint256"
            }
        ],
        "name": "PlayerUpdate",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "address",
                "name": "player",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "from",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "to",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "time",
                "type": "uint256"
            }
        ],
        "name": "Trace",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "actionCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "actions",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "step",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "from",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "to",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "time",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "player",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "color",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "diskMemory",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "factory",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "flashMemory",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_start",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_end",
                "type": "uint256"
            }
        ],
        "name": "getActions",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "step",
                        "type": "uint256"
                    },
                    {
                        "internalType": "string",
                        "name": "from",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "to",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "time",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "player",
                        "type": "address"
                    }
                ],
                "internalType": "struct Apple.Action[]",
                "name": "atcs",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getApple",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "_id",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_memory",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_disk",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_count",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "_player",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "_color",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "id",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_player",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_id",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_memory",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_disk",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_color",
                "type": "string"
            }
        ],
        "name": "initialize",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "player",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_from",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_to",
                "type": "string"
            }
        ],
        "name": "processAction",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_player",
                "type": "address"
            }
        ],
        "name": "updatePlayer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

