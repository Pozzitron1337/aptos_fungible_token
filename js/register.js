require("dotenv").config();
const fs = require("fs");

const aptos = require("aptos");

const NODE_URL = process.env.APTOS_NODE_URL || "https://fullnode.devnet.aptoslabs.com";
const FAUCET_URL = process.env.APTOS_FAUCET_URL || "https://faucet.devnet.aptoslabs.com";

const moduleName = "token7"

const {
    ADMIN_PRIVATE_KEY
} = process.env;

(async () => {
    const client = new aptos.AptosClient(NODE_URL);
    const faucetClient = new aptos.FaucetClient(NODE_URL, FAUCET_URL, null);

    let privateKey = Uint8Array.from(Buffer.from(ADMIN_PRIVATE_KEY, 'hex'));
    const admin = new aptos.AptosAccount(privateKey);
    const someUser = new aptos.AptosAccount(privateKey)
    let adminAddress = admin.address().hexString || "0xBEEF"

    const payload = {
        function: adminAddress + "::" + moduleName + "::" + "register",
        type_arguments: [],
        arguments: [
            adminAddress,
            "5000000"
        ],
        type: "entry_function_payload",
        
    }
    const option = {
        max_gas_amount: 500_000,
        gas_unit_price: 107,
    };
    const txnRequest = await client.generateTransaction(someUser.address(), payload, option);
    const signedTxn = await client.signTransaction(admin, txnRequest);
    const transactionRes = await client.submitTransaction(signedTxn);
    await client.waitForTransaction(transactionRes.hash);
})();
