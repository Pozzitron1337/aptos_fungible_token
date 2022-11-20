require("dotenv").config();
const fs = require("fs");

const aptos = require("aptos");

const NODE_URL = process.env.APTOS_NODE_URL || "https://fullnode.devnet.aptoslabs.com";
const FAUCET_URL = process.env.APTOS_FAUCET_URL || "https://faucet.devnet.aptoslabs.com";

const aptosCoin = "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>";

const {
    ADMIN_PRIVATE_KEY
} = process.env;

(async () => {
    const client = new aptos.AptosClient(NODE_URL);
    const faucetClient = new aptos.FaucetClient(NODE_URL, FAUCET_URL, null);

    let privateKey = Uint8Array.from(Buffer.from(ADMIN_PRIVATE_KEY, 'hex'));
    const admin = new aptos.AptosAccount(privateKey);
    let resources = await client.getAccountResources(admin.address());
    let accountResource = resources.find((r) => r.type === aptosCoin);
    console.log(`admin coins: ${accountResource.data.coin.value}`);


    let packageMetadata_path = 'build/token8/package-metadata.bcs'
    let moduleData_path = 'build/token8/bytecode_modules/token8.mv'
    let packageMetadata_raw = fs.readFileSync(packageMetadata_path, (err, data) => {})
    let moduleData_raw = fs.readFileSync(moduleData_path, (err, data) => {})
    let moduleData_hex = new aptos.HexString(moduleData_raw.toString("hex")).toUint8Array()
    
    let packageMetadata = new aptos.HexString(packageMetadata_raw.toString("hex")).toUint8Array()
    let moduleData = new aptos.TxnBuilderTypes.Module(moduleData_hex);
   

    let txHash = await client.publishPackage(admin, packageMetadata, [moduleData]);
    console.log(txHash);
    await client.waitForTransaction(txHash, { checkSuccess: true });
   
})();
