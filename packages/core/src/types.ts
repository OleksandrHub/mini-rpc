export interface RPCRequest {
  jsonrpc: '2.0';
  method: string;
  params?: any[];
  id?: string | number | null;
}

export interface RPCResponse {
  jsonrpc: '2.0';
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
  id?: string | number | null;
}