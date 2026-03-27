const axios = require('axios');
const config = require('../config');

class IPFSClient {
  constructor(projectId, projectSecret) {
    this.projectId = projectId;
    this.projectSecret = projectSecret;
    this.gateway = config.ipfs.gateway;
  }

  // Pin JSON data to IPFS via Infura
  async pinData(data) {
    try {
      const response = await axios.post('https://ipfs.infura.io:5001/api/v0/add', 
        JSON.stringify(data),
        {
          auth: {
            username: this.projectId,
            password: this.projectSecret,
          },
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const ipfsHash = response.data.Hash;
      return {
        hash: ipfsHash,
        url: `${this.gateway}/ipfs/${ipfsHash}`,
      };
    } catch (error) {
      console.error('IPFS Pin Error:', error.message);
      throw new Error(`Failed to pin data to IPFS: ${error.message}`);
    }
  }

  // Retrieve data from IPFS
  async getData(ipfsHash) {
    try {
      const url = `${this.gateway}/ipfs/${ipfsHash}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('IPFS Retrieve Error:', error.message);
      throw new Error(`Failed to retrieve data from IPFS: ${error.message}`);
    }
  }

  // Generate accessible gateway URL
  getGatewayUrl(ipfsHash) {
    return `${this.gateway}/ipfs/${ipfsHash}`;
  }
}

module.exports = IPFSClient;
