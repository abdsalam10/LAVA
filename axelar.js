const axios = require("axios");

// Axelar RPC URLs
const rpcEndpoints = ["https://tm.axelar.lava.build/lava-referer-daf6113e-e7c8-4eaa-bd4d-ce06af942f78/"];

// Header for Axelar RPC requests
const headers = {
  "Content-Type": "application/json",
};

// Array of payloads for Axelar
const payloads = [
  {
    jsonrpc: "2.0",
    id: 1,
    method: "status",
    params: [],
  },
  {
    jsonrpc: "2.0",
    id: 2,
    method: "health",
    params: [],
    },
];

// Function to make Axelar RPC requests
async function makeRpcRequests() {
  try {
    // Iterate over each Axelar RPC endpoint
    for (let rpcEndpoint of rpcEndpoints) {
      // Iterate over each payload
      for (let payload of payloads) {
        // Send request to the current Axelar RPC with the payload
        const response = await axios.post(rpcEndpoint, payload, {
          headers: headers,
        });

        // Log response
        console.log(`Response from Axelar method ${payload.method} at ${rpcEndpoint}:`);
        console.log(response.data);
      }
    }
  } catch (error) {
    console.error("Error making Axelar RPC requests:", error.message);
  }
}

// Function to execute Axelar RPC requests
function executeRpcRequests() {
  makeRpcRequests(); // Run immediately

  // Set up setInterval for subsequent runs (adjust interval as needed)
  setInterval(makeRpcRequests, 10000);
}

// Call executeRpcRequests to start the process
executeRpcRequests();
