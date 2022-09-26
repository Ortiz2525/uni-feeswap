export interface MoralisNFTBalanceResult {
  result: NFTBalance[];
}

export interface NFTBalance {
  token_address: string; // lowercase address
  token_id: string;
  owner_of: string;
  block_number: string;
  block_number_minted: string;
  token_hash: string;
  amount: string; // "1"
  contract_type: string; // "ERC721"
  name: string; // "Uniswap V3 Positions NFT-V1
  symbol: string; // "UNI-V3-POS"
  token_uri: string; // "Invalid uri"
  metadata: string; // JSON
  last_token_uri_sync: string;
  last_metadata_sync: string;
}

export interface UniV3Position {
  token_id: string;
  metadata: UniV3Metadata;
}

export interface UniV3Metadata {
  name: string; // "Uniswap - 1% - UNI/WETH - 1.0000<>1.9738"
  image: string; // "data:image/svg+xml;base64,..."
  description: string;
}
