const axios = require("axios");

const RPC_URLS = ["https://near.lava.build/lava-referer-daf6113e-e7c8-4eaa-bd4d-ce06af942f78/"];

const walletAddress = "cd575553bed06132b849d25f6f8fcfa0425743c538e2422347dd88f27a168c0b";

async function getGasPrice(url) {
    try {
        const response = await axios.post(url, {
            jsonrpc: "2.0",
            method: "gas_price",
            params: [null],
            id: 1
        }, {
            headers: { "Content-Type": "application/json" }
        });

        const gasPrice = response.data.result.gas_price;
        console.log(`Current gas price on ${url} is ${gasPrice}`);
    } catch (error) {
        console.error(`Failed to fetch gas price from ${url}:`, error.message);
    }
}

async function getBlock(url) {
    try {
        const response = await axios.post(url, {
            jsonrpc: "2.0",
            method: "block",
            params: { finality: "final" },
            id: 1
        }, {
            headers: { "Content-Type": "application/json" }
        });

        console.log(`Response from getBlock request on ${url}:`, response.data);
    } catch (error) {
        console.error(`Failed to fetch block from ${url}:`, error.message);
    }
}

async function getNetworkInfo(url) {
    try {
        const response = await axios.post(url, {
            jsonrpc: "2.0",
            method: "network_info",
            params: [],
            id: 1
        }, {
            headers: { "Content-Type": "application/json" }
        });

        console.log(`Response from getNetworkInfo request on ${url}:`, response.data);
    } catch (error) {
        console.error(`Failed to fetch network info from ${url}:`, error.message);
    }
}

async function getStatus(url) {
    try {
        const response = await axios.post(url, {
            jsonrpc: "2.0",
            method: "status",
            params: [],
            id: 1
        }, {
            headers: { "Content-Type": "application/json" }
        });

        console.log(`Response from getStatus request on ${url}:`, response.data);
    } catch (error) {
        console.error(`Failed to fetch status from ${url}:`, error.message);
    }
}

async function walletBalance(url) {
    try {
        const response = await axios.post(url, {
            jsonrpc: "2.0",
            method: "query",
            params: {
                request_type: "view_account",
                finality: "final",
                account_id: walletAddress
            },
            id: 1
        }, {
            headers: { "Content-Type": "application/json" }
        });

        const balanceAmount = response.data.result.amount;
        const formattedBalance = (parseFloat(balanceAmount) / 1e24).toFixed(5);
        console.log(`The balance of ${walletAddress} on ${url} is ${formattedBalance}`);
    } catch (error) {
        console.error(`Failed to fetch wallet balance from ${url}:`, error.message);
    }
}

async function executeRequests() {
    for (let url of RPC_URLS) {
        await walletBalance(url);
        await getStatus(url);
        await getNetworkInfo(url);
        await getBlock(url);
        await getGasPrice(url);
    }
}

// Initial execution
executeRequests();

// Subsequent executions with 10-second interval
setInterval(executeRequests, 10000);