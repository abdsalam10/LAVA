const axios = require("axios");

// StarkNet RPC URLs
const rpcEndpoints = ["https://rpc.starknet.lava.build/lava-referer-daf6113e-e7c8-4eaa-bd4d-ce06af942f78/"];

// Headers for StarkNet RPC requests
const headers = {
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

// Payloads for StarkNet
const payloads = [
  {
    jsonrpc: "2.0",
    id: 1,
    method: "starknet_blockNumber",
    params: [],
  },
  {
    jsonrpc: "2.0",
    id: 2,
    method: "starknet_getStateUpdate",
    params: ["latest"],
    },
    {
        jsonrpc: "2.0",
        id: 3,
        method: "starknet_chainId",
    },
    {
        jsonrpc: "2.0",
        id: 4,
        method: "starknet_getBlockTransactionCount",
        params: ["latest"],
    },
    {
        jsonrpc: "2.0",
        id: 5,
        method: "starknet_getBlockWithTxs",
        params: ["latest"],
      },
      {
        jsonrpc: "2.0",
        id: 6,
        method: "starknet_syncing",
      },
];

// Function to make StarkNet RPC requests
async function makeRpcRequests() {
  try {
    // Array to store promises for all requests
    const requestPromises = [];

    // Iterate over each StarkNet RPC endpoint
    for (let endpoint of rpcEndpoints) {
      // Array to store promises for requests to the current StarkNet RPC
      const endpointPromises = [];

      // Iterate over each payload
      for (let payload of payloads) {
        // Send request to the current StarkNet RPC with the current payload
        const requestPromise = axios.post(endpoint, payload, {
          headers: headers,
        });

        // Push the promise to the array for requests to the current StarkNet RPC
        endpointPromises.push(requestPromise);
      }

      // Push all promises for requests to the current StarkNet RPC to the array of all requests
      requestPromises.push(Promise.all(endpointPromises));
    }

    // Wait for all requests to complete
    const responses = await Promise.all(requestPromises);

    // Process responses
    responses.forEach((endpointResponses, index) => {
      // Get the StarkNet RPC URL
      const endpoint = rpcEndpoints[index];

      // Iterate over responses for the current StarkNet RPC
      endpointResponses.forEach((response, idx) => {
        // Get the corresponding payload
        const payload = payloads[idx];

        // Example handling of response data
        console.log(
          `Response from StarkNet method ${payload.method} at ${endpoint}:`
        );
        console.log(response.data);
      });
    });
  } catch (error) {
    console.error("Error making StarkNet RPC requests:", error.message);
  }
}

// Function to execute StarkNet RPC requests
function executeRpcRequests() {
  makeRpcRequests(); // Run immediately

  // Set up setInterval for subsequent runs (adjust interval as needed)
  setInterval(makeRpcRequests, 10000);
}

// Call executeRpcRequests to start the process
executeRpcRequests();
