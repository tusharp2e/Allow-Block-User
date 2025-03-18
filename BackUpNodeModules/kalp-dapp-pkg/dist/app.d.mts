declare const getToken: () => string;
declare const connectToWallet: (token: string, name: string, dappURL: string, dappIcon: string) => Promise<boolean>;
declare const reEngageEvents: (token: string, name: string, dappURL: string, dappIcon: string) => Promise<boolean>;
declare const getEnrollmentIdFromWallet: (token: string, name: string, dappURL: string, dappIcon: string) => Promise<string | undefined>;
declare const writeTransactionFromWallet: (token: string, name: string, dappURL: string, dappIcon: string, channelName: string, chaincodeName: string, transactionName: string, transactionParams: any[]) => Promise<any>;
declare const readTransactionFromWallet: (token: string, name: string, dappURL: string, dappIcon: string, channelName: string, chaincodeName: string, transactionName: string, transactionParams: any[]) => Promise<any>;
declare const disconnectWallet: (token: string, name: string, dappURL: string, dappIcon: string) => Promise<any>;

export { connectToWallet, disconnectWallet, getEnrollmentIdFromWallet, getToken, reEngageEvents, readTransactionFromWallet, writeTransactionFromWallet };
