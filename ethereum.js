// Lava Reborn ✅✅✅✅✅

const axios = require("axios");

// Input your RPC urls
const rpcEndpoints = ["https://eth1.lava.build/lava-referer-daf6113e-e7c8-4eaa-bd4d-ce06af942f78/"];

// Input your wallet address here
const walletAddress = "0x47e1b128109FAf674d03ACDC038Fe3338eA1B8E6";

// ENS payload data - don't modify it 🛑
const data =
  "0xcbf8b66c00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000001000000000000000000000000" +
  walletAddress.slice(2);

// Headers sniffed from Metamask - 👆 to Lava Dev
const Headers = {
  "sec-ch-ua":
    '"Chromium";v="124", "Microsoft Edge";v="124", "Not-A.Brand";v="99"',
  Accept: "application/json",
  "Content-Type": "application/json",
  "sec-ch-ua-mobile": "?0",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0",
  "sec-ch-ua-platform": '"Windows"',
  Origin: "chrome-extension://ejbalbakoplchlghecdalmeeeajnimhm",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Dest": "empty",
  "Accept-Encoding": "gzip, deflate",
  "Accept-Language": "en-US,en;q=0.9",
};

// Function to convert wei to ether
function weiToEth(wei) {
  return wei / 1e18; // 1 Ether = 1e18 wei or 1000000000000000000
}

// Function to decode hexadecimal data to ASCII
function hexToAscii(hex) {
  // Check if the hex string starts with "0x"
  if (hex.slice(0, 2) === "0x") {
    // If it does, remove the "0x" prefix
    hex = hex.slice(2);
  }

  // Initialize an empty string to store the ASCII characters
  let str = "";

  // Parse the hexadecimal string into bytes
  for (let i = 0; i < hex.length; i += 2) {
    // Convert each pair of hexadecimal characters into their ASCII equivalent
    let charCode = parseInt(hex.substr(i, 2), 16);
    // Check if the character is printable ASCII or a space character
    if (charCode >= 32 && charCode <= 126) {
      // Append the ASCII character to the result string
      str += String.fromCharCode(charCode);
    }
  }
  return str;
}


// Axios RPC Payloads
const payloads = [
  { method: "eth_chainId", params: [], id: 1 },
  { method: "eth_protocolVersion", params: [], id: 2 },
  { method: "net_version", params: [], id: 3 },
  { method: "eth_getBlockByNumber", params: ["latest", true], id: 4 },
  {
    method: "eth_getLogs",
    params: [
      { fromBlock: "latest", toBlock: "latest", address: walletAddress },
    ],
    id: 5,
  },
  {
    method: "eth_getTransactionReceipt",
    params: [
      "0xf7ac13b8a6872aa5b24dd1a407350b0bd0ec7883ec1a03b659defdfac47f6d9c",
    ],
    id: 6,
  },
  { method: "eth_blockNumber", params: [], id: 7 },
  {
    method: "eth_call",
    params: [
      {
        to: "0xb1f8e55c7f64d203c1400b9d8555d050f94adf39",
        data: "0xf000",
      },
      "latest",
    ],
    id: 8,
  },
  {
    method: "eth_getBalance",
    params: [walletAddress, "latest"],
    id: 9,
  },
  {
    id: 10,
    jsonrpc: "2.0",
    method: "eth_call",
    params: [
      {
        from: "0x0000000000000000000000000000000000000000",
        data: data,
        to: "0x3671ae578e63fdf66ad4f3e12cc0c0d71ac7510c",
      },
      "0x12d2447",
    ],
  },
];

// RPC requests
async function makeRpcRequests() {
  try {
    // Array to store promises for all requests
    const requestPromises = [];

    // Iterate over each RPC endpoint
    for (let endpoint of rpcEndpoints) {
      // Array to store promises for requests to the current Lava rpc
      const endpointPromises = [];

      // Iterate over each payload
      for (let payload of payloads) {
        // Send request to the current Lava rpc with the current payload
        const requestPromise = axios.post(endpoint, payload, {
          headers: Headers,
        });

        // Push the promise to the array for requests to the current Lava rpc
        endpointPromises.push(requestPromise);
      }

      // Push all promises for requests to the current Lava rpc to the array of all requests
      requestPromises.push(Promise.all(endpointPromises));
    }

    // Wait for all requests to complete
    const responses = await Promise.all(requestPromises);

    // Process responses
    responses.forEach((endpointResponses, index) => {
      // Get the RPC URL
      const endpoint = rpcEndpoints[index];

      // Iterate over responses for the current Lava rpc
      endpointResponses.forEach((response, idx) => {
        const payload = payloads[idx];

        if (payload.id === 10) {
          // Check if the result is empty
          if (!response.data.result) {
            console.log("You don't have an ENS domain name.");
          } else {
            // Decode the ENS name from the result
            const decodedResult = hexToAscii(response.data.result);
            console.log(`The ENS for ${walletAddress} is: ${decodedResult}`);
          }
        } else {
          console.log(`Response from ${payload.method} at ${endpoint}:`);
          if (payload.method === "eth_getBalance") {
            console.log(
              `Balance for address ${walletAddress}: is ${weiToEth(
                parseInt(response.data.result)
              )} ETH`
            );
          } else {
            console.log(response.data);
          }
        }
      });
    });
  } catch (error) {
    console.error("Error making RPC requests:", error.message);
  }
}

function executeRpcRequests() {
  makeRpcRequests(); // run immediately

  // Set up setInterval for subsequent runs - 10 seconds ⏱️ - adjust it if you like
  setInterval(makeRpcRequests, 10000);
}

// Call executeRpcRequests to start the process
executeRpcRequests();
