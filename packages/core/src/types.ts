export interface RPCRequest<P extends unknown[] = unknown[]> {
  jsonrpc: '2.0';
  method: string;
  params?: P;
  id?: string | number | null;
}

export interface RPCResponse<R = unknown> {
  jsonrpc: '2.0';
  result?: R;
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
  id?: string | number | null;
}