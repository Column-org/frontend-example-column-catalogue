export const ABI = {
    "address": "0x6572d55bc0d8e3d026d54f0ed1c7cc75e2492515cfd803cb12adb84776f21036",
    "name": "onchain_bio",
    "friends": [],
    "exposed_functions": [
        {
            "name": "register",
            "visibility": "public",
            "is_entry": true,
            "is_view": false,
            "generic_type_params": [],
            "params": [
                "&signer",
                "0x1::string::String",
                "0x1::string::String"
            ],
            "return": []
        },
        {
            "name": "signature",
            "visibility": "public",
            "is_entry": false,
            "is_view": true,
            "generic_type_params": [],
            "params": [],
            "return": [
                "address"
            ]
        }
    ],
    "structs": [
        {
            "name": "Bio",
            "is_native": false,
            "is_event": false,
            "abilities": [
                "drop",
                "store",
                "key"
            ],
            "generic_type_params": [],
            "fields": [
                {
                    "name": "name",
                    "type": "0x1::string::String"
                },
                {
                    "name": "bio",
                    "type": "0x1::string::String"
                }
            ]
        }
    ]
}