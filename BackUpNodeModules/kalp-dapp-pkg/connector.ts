import {
  EVENT_DISPATCHER_CONNECT_TOPIC,
  EVENT_LISTNER_REGISTER_TOPIC,
  METHODNAMES,
} from "./constants";
import { v4 as uuidv4 } from "uuid";
import { EventDetail, FunctionObject, windowWallet } from "./helper";

const registerDAppToken = async (dappToken: string, dappName: string, dappURL: string, dappIcon: string): Promise<any> => {
  const methodCallId = "";
  const methodName = METHODNAMES.CONNECT_TO_WALLET;
  const methodArgs: any[] = [];

  const registerDAppTokenPromise = new Promise<any>((resolve, reject) => {
    const eventListenerFunction = async (event: CustomEvent<string>) => {
      try {
        const result = await handleConnectToWallet(event);
        console.log("res", result)
        resolve(result);
      } catch (error) {
        reject(error);
      } finally {
        // windowWallet.removeEventListener(
        //   EVENT_LISTNER_REGISTER_TOPIC + "_" + dappToken,
        //   eventListenerFunction,
        // );
      }
    };
    windowWallet.addEventListener(
      EVENT_LISTNER_REGISTER_TOPIC + "_" + dappToken,
      eventListenerFunction,
    );
  });

  const functionObject: FunctionObject = {
    dappToken: dappToken,
    dappName: dappName,
    dappIcon: dappIcon,
    dappURL: dappURL,
    methodArgs: methodArgs,
    methodCallId: methodCallId,
    methodName: methodName,
  };

  const stringFunctionObject = JSON.stringify(functionObject);
  window.dispatchEvent(
    new CustomEvent(EVENT_DISPATCHER_CONNECT_TOPIC, {
      detail: stringFunctionObject,
    }),
  );

  return registerDAppTokenPromise;
};

const reEngagingEvents = async (dappToken: string, dappName: string, dappURL: string, dappIcon: string): Promise<any> => {
  const methodCallId = "";
  const methodName = METHODNAMES.REENGAGE_EVENTS;
  const methodArgs: any[] = [];

  const registerDAppTokenPromise = new Promise<any>((resolve, reject) => {
    const eventListenerFunction = async (event: CustomEvent<string>) => {
      try {
        const result = await handleConnectToWallet(event);
        resolve(result);
      } catch (error) {
        reject(error);
      } finally {
        windowWallet.removeEventListener(
          EVENT_LISTNER_REGISTER_TOPIC + "_" + dappToken,
          eventListenerFunction,
        );
      }
    };
    windowWallet.addEventListener(
      EVENT_LISTNER_REGISTER_TOPIC + "_" + dappToken,
      eventListenerFunction,
    );
  });

  const functionObject: FunctionObject = {
    dappToken: dappToken,
    dappName: dappName,
    dappIcon: dappIcon,
    dappURL: dappURL,
    methodArgs: methodArgs,
    methodCallId: methodCallId,
    methodName: methodName,
  };


  const stringFunctionObject = JSON.stringify(functionObject);
  window.dispatchEvent(
    new CustomEvent(EVENT_DISPATCHER_CONNECT_TOPIC, {
      detail: stringFunctionObject,
    }),
  );

  return registerDAppTokenPromise;
};

const getEnrollmentId = async (dappToken: string, dappName: string, dappURL: string, dappIcon: string): Promise<string> => {
  const methodCallId = uuidv4();
  const methodName = METHODNAMES.GET_ENROLLMENTID;

  const methodArgs: any[] = [];

  const getEnrollmentIdFromWalletPromise = new Promise<string>(
    (resolve, reject) => {
      const eventListenerFunction = async (event: CustomEvent<string>) => {
        try {
          const result = await handleEnrollmentId(event);
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          windowWallet.removeEventListener(
            `kalp:${methodName}` + "_" + dappToken + "_" + methodCallId,
            eventListenerFunction,
          );
        }
      };
      windowWallet.addEventListener(
        `kalp:${methodName}` + "_" + dappToken + "_" + methodCallId,
        eventListenerFunction,
      );
    },
  );

  const functionObject: FunctionObject = {
    dappToken: dappToken,
    dappName: dappName,
    dappIcon: dappIcon,
    dappURL: dappURL,
    methodArgs: methodArgs,
    methodCallId: methodCallId,
    methodName: methodName,
  };

  console.log("hello get enrollemne", functionObject)
  const stringFunctionObject = JSON.stringify(functionObject);
  window.dispatchEvent(
    new CustomEvent(`kalp:${dappToken}`, { detail: stringFunctionObject }),
  );
  return getEnrollmentIdFromWalletPromise;
};

const writeTransaction = async (
  dappToken: string,
  dappName: string,
  dappURL: string, dappIcon: string,
  channelName: string,
  chaincodeName: string,
  transactionName: string,
  transactionParams: any[],
): Promise<any> => {
  const methodCallId = uuidv4();
  const methodName = METHODNAMES.WRITE_TRANSACTION;
  const methodArgs: any[] = [
    channelName,
    chaincodeName,
    transactionName,
    transactionParams,
  ];

  const writeTransactionFromWalletPromise = new Promise<any>(
    (resolve, reject) => {
      const eventListenerFunction = async (event: CustomEvent<string>) => {
        try {
          const result = await handleWriteTransaction(event);
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          windowWallet.removeEventListener(
            `kalp:${methodName}` + "_" + dappToken + "_" + methodCallId,
            eventListenerFunction,
          );
        }
      };
      windowWallet.addEventListener(
        `kalp:${methodName}` + "_" + dappToken + "_" + methodCallId,
        eventListenerFunction,
      );
    },
  );

  const functionObject: FunctionObject = {
    dappToken: dappToken,
    dappName: dappName,
    dappIcon: dappIcon,
    dappURL: dappURL,
    methodArgs: methodArgs,
    methodCallId: methodCallId,
    methodName: methodName,
  };

  console.log("bdhabhad", functionObject)
  const stringFunctionObject = JSON.stringify(functionObject);
  window.dispatchEvent(
    new CustomEvent(`kalp:${METHODNAMES.WRITE_TRANSACTION}`, { detail: stringFunctionObject }),
  );

  return writeTransactionFromWalletPromise;
};

const readTransaction = async (
  dappToken: string,
  dappName: string,
  dappURL: string, dappIcon: string,
  channelName: string,
  chaincodeName: string,
  transactionName: string,
  transactionParams: any[],
): Promise<any> => {
  const methodCallId = uuidv4();

  const methodName = METHODNAMES.READ_TRANSACTION;
  const methodArgs: any[] = [
    channelName,
    chaincodeName,
    transactionName,
    transactionParams,
  ];

  const readTransactionFromWalletPromise = new Promise<any>(
    (resolve, reject) => {
      const eventListenerFunction = async (event: CustomEvent<string>) => {
        try {
          const result = await handleReadTransaction(event);
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          windowWallet.removeEventListener(
            `kalp:${methodName}` + "_" + dappToken + "_" + methodCallId,
            eventListenerFunction,
          );
        }
      };
      windowWallet.addEventListener(
        `kalp:${methodName}` + "_" + dappToken + "_" + methodCallId,
        eventListenerFunction,
      );
    },
  );

  const functionObject: FunctionObject = {
    dappToken: dappToken,
    dappName: dappName,
    dappIcon: dappIcon,
    dappURL: dappURL,
    methodArgs: methodArgs,
    methodCallId: methodCallId,
    methodName: methodName,
  };

  const stringFunctionObject = JSON.stringify(functionObject);
  window.dispatchEvent(
    new CustomEvent(`kalp:${METHODNAMES.READ_TRANSACTION}`, { detail: stringFunctionObject }),
  );
  return readTransactionFromWalletPromise;
};

const disconnect = async (dappToken: string, dappName: string, dappURL: string, dappIcon: string): Promise<any> => {
  const methodCallId = uuidv4();
  const methodName = METHODNAMES.DISCONNECT_WALLET;
  const methodArgs: any[] = [];
  const disconnectWalletPromise = new Promise<any>((resolve, reject) => {
    const eventListenerFunction = async (event: CustomEvent<string>) => {
      try {
        const result = await handleDisconnectWallet(event);
        resolve(result);
      } catch (error) {
        reject(error);
      } finally {
        windowWallet.removeEventListener(
          `kalp:${methodName}` + "_" + dappToken + "_" + methodCallId,
          eventListenerFunction,
        );
      }
    };
    windowWallet.addEventListener(
      `kalp:${methodName}` + "_" + dappToken + "_" + methodCallId,
      eventListenerFunction,
    );
  });

  const functionObject: FunctionObject = {
    dappToken: dappToken,
    dappName: dappName,
    dappIcon: dappIcon,
    dappURL: dappURL,
    methodArgs: methodArgs,
    methodCallId: methodCallId,
    methodName: methodName,
  };

  const stringFunctionObject = JSON.stringify(functionObject);
  window.dispatchEvent(
    new CustomEvent(`kalp:${dappToken}`, { detail: stringFunctionObject }),
  );
  return disconnectWalletPromise;
};

const handleConnectToWallet = (event: CustomEvent<string>): Promise<any> => {
  return new Promise((resolve, reject) => {
    console.log("event to connect", event)
    if (event !== null) {
      try {
        const eventDetail: EventDetail = JSON.parse(event.detail);
        console.log("erjbe", eventDetail)
        resolve(eventDetail);
      } catch (error) {
        reject(
          new Error(
            "Failed to parse event detail in handleConnectToWallet: " +
            error.message,
          ),
        );
      }
    } else {
      reject(new Error("Event is null in handleConnectToWallet"));
    }
  });
};

const handleReadTransaction = (event: CustomEvent<string>): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (event !== null) {
      try {
        const eventDetail: EventDetail = JSON.parse(event.detail);
        resolve(eventDetail.output);
      } catch (error) {
        reject(
          new Error(
            "Failed to parse event detail in handleReadTransaction: " +
            error.message,
          ),
        );
      }
    } else {
      reject(new Error("Event is null in handleReadTransaction"));
    }
  });
};

const handleEnrollmentId = (event: CustomEvent<string>): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (event !== null) {
      try {
        const eventDetail: EventDetail = JSON.parse(event.detail);
        console.log("eventDetail for enrollmentid", eventDetail)
        resolve(eventDetail.result?.enrollmentId);
      } catch (error) {
        reject(
          new Error(
            "Failed to parse event detail in handleEnrollmentId: " +
            error.message,
          ),
        );
      }
    } else {
      reject(new Error("Event is null in handleEnrollmentId"));
    }
  });
};

const handleWriteTransaction = (event: CustomEvent<string>): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (event !== null) {
      try {
        const eventDetail: EventDetail = JSON.parse(event.detail);
        resolve(eventDetail.output);
      } catch (error) {
        reject(
          new Error(
            "Failed to parse event detail in handleWriteTransaction: " +
            error.message,
          ),
        );
      }
    } else {
      reject(new Error("Event is null in handleWriteTransaction"));
    }
  });
};

const handleDisconnectWallet = (event: CustomEvent<string>): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (event !== null) {
      try {
        const eventDetail: EventDetail = JSON.parse(event.detail);
        resolve(eventDetail.output);
      } catch (error) {
        reject(
          new Error(
            "Failed to parse event detail in handleDisconnectWallet: " +
            error.message,
          ),
        );
      }
    } else {
      reject(new Error("Event is null in handleDisconnectWallet"));
    }
  });
};

export {
  registerDAppToken,
  reEngagingEvents,
  getEnrollmentId,
  writeTransaction,
  readTransaction,
  disconnect,
};
