
let dappToken: string;
let dappName: string;
 
interface FunctionObject {
  dappToken: string;
  dappName: string;
  dappURL: string;
  dappIcon: string;
  methodArgs: any[];
  methodCallId: string;
  methodName: string;
}
 
interface EventDetail {
  output: any;
  result?: {
    enrollmentId: string;
  };
}
const windowWallet: any = window;

export {
  dappToken,
  dappName,
  FunctionObject,
  EventDetail,
  windowWallet
}