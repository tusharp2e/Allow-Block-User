// app.ts
import { v4 as uuidv42 } from "uuid";

// utils/errors.ts
var CustomError = class _CustomError extends Error {
  statusCode;
  errorCode;
  timestamp;
  constructor(message, statusCode, errorCode) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.timestamp = (/* @__PURE__ */ new Date()).toISOString();
    Object.setPrototypeOf(this, _CustomError.prototype);
  }
};
var ValidationError = class _ValidationError extends CustomError {
  constructor(message = "Validation failed") {
    super(message, 400, "VALIDATION_ERROR");
    Object.setPrototypeOf(this, _ValidationError.prototype);
  }
};
var InternalServerError = class _InternalServerError extends CustomError {
  constructor(message = "Internal server error") {
    super(message, 500, "INTERNAL_SERVER_ERROR");
    Object.setPrototypeOf(this, _InternalServerError.prototype);
  }
};

// constants.ts
var METHODNAMES = {
  CONNECT_TO_WALLET: "connectToWallet",
  GET_ENROLLMENTID: "getEnrollmentId",
  WRITE_TRANSACTION: "writeTransaction",
  READ_TRANSACTION: "readTransaction",
  DISCONNECT_WALLET: "disconnectWallet",
  REENGAGE_EVENTS: "reengageEvents"
};
var EVENT_LISTNER_REGISTER_TOPIC = "kalp:announceDAppToken";
var EVENT_DISPATCHER_CONNECT_TOPIC = "kalp:connectToWallet";

// connector.ts
import { v4 as uuidv4 } from "uuid";

// helper.ts
var windowWallet = window;

// connector.ts
var registerDAppToken = async (dappToken, dappName, dappURL, dappIcon) => {
  const methodCallId = "";
  const methodName = METHODNAMES.CONNECT_TO_WALLET;
  const methodArgs = [];
  const registerDAppTokenPromise = new Promise((resolve, reject) => {
    const eventListenerFunction = async (event) => {
      try {
        const result = await handleConnectToWallet(event);
        console.log("res", result);
        resolve(result);
      } catch (error) {
        reject(error);
      } finally {
      }
    };
    windowWallet.addEventListener(
      EVENT_LISTNER_REGISTER_TOPIC + "_" + dappToken,
      eventListenerFunction
    );
  });
  const functionObject = {
    dappToken,
    dappName,
    dappIcon,
    dappURL,
    methodArgs,
    methodCallId,
    methodName
  };
  const stringFunctionObject = JSON.stringify(functionObject);
  window.dispatchEvent(
    new CustomEvent(EVENT_DISPATCHER_CONNECT_TOPIC, {
      detail: stringFunctionObject
    })
  );
  return registerDAppTokenPromise;
};
var reEngagingEvents = async (dappToken, dappName, dappURL, dappIcon) => {
  const methodCallId = "";
  const methodName = METHODNAMES.REENGAGE_EVENTS;
  const methodArgs = [];
  const registerDAppTokenPromise = new Promise((resolve, reject) => {
    const eventListenerFunction = async (event) => {
      try {
        const result = await handleConnectToWallet(event);
        resolve(result);
      } catch (error) {
        reject(error);
      } finally {
        windowWallet.removeEventListener(
          EVENT_LISTNER_REGISTER_TOPIC + "_" + dappToken,
          eventListenerFunction
        );
      }
    };
    windowWallet.addEventListener(
      EVENT_LISTNER_REGISTER_TOPIC + "_" + dappToken,
      eventListenerFunction
    );
  });
  const functionObject = {
    dappToken,
    dappName,
    dappIcon,
    dappURL,
    methodArgs,
    methodCallId,
    methodName
  };
  const stringFunctionObject = JSON.stringify(functionObject);
  window.dispatchEvent(
    new CustomEvent(EVENT_DISPATCHER_CONNECT_TOPIC, {
      detail: stringFunctionObject
    })
  );
  return registerDAppTokenPromise;
};
var getEnrollmentId = async (dappToken, dappName, dappURL, dappIcon) => {
  const methodCallId = uuidv4();
  const methodName = METHODNAMES.GET_ENROLLMENTID;
  const methodArgs = [];
  const getEnrollmentIdFromWalletPromise = new Promise(
    (resolve, reject) => {
      const eventListenerFunction = async (event) => {
        try {
          const result = await handleEnrollmentId(event);
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          windowWallet.removeEventListener(
            `kalp:${methodName}_` + dappToken + "_" + methodCallId,
            eventListenerFunction
          );
        }
      };
      windowWallet.addEventListener(
        `kalp:${methodName}_` + dappToken + "_" + methodCallId,
        eventListenerFunction
      );
    }
  );
  const functionObject = {
    dappToken,
    dappName,
    dappIcon,
    dappURL,
    methodArgs,
    methodCallId,
    methodName
  };
  console.log("hello get enrollemne", functionObject);
  const stringFunctionObject = JSON.stringify(functionObject);
  window.dispatchEvent(
    new CustomEvent(`kalp:${dappToken}`, { detail: stringFunctionObject })
  );
  return getEnrollmentIdFromWalletPromise;
};
var writeTransaction = async (dappToken, dappName, dappURL, dappIcon, channelName, chaincodeName, transactionName, transactionParams) => {
  const methodCallId = uuidv4();
  const methodName = METHODNAMES.WRITE_TRANSACTION;
  const methodArgs = [
    channelName,
    chaincodeName,
    transactionName,
    transactionParams
  ];
  const writeTransactionFromWalletPromise = new Promise(
    (resolve, reject) => {
      const eventListenerFunction = async (event) => {
        try {
          const result = await handleWriteTransaction(event);
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          windowWallet.removeEventListener(
            `kalp:${methodName}_` + dappToken + "_" + methodCallId,
            eventListenerFunction
          );
        }
      };
      windowWallet.addEventListener(
        `kalp:${methodName}_` + dappToken + "_" + methodCallId,
        eventListenerFunction
      );
    }
  );
  const functionObject = {
    dappToken,
    dappName,
    dappIcon,
    dappURL,
    methodArgs,
    methodCallId,
    methodName
  };
  console.log("bdhabhad", functionObject);
  const stringFunctionObject = JSON.stringify(functionObject);
  window.dispatchEvent(
    new CustomEvent(`kalp:${METHODNAMES.WRITE_TRANSACTION}`, { detail: stringFunctionObject })
  );
  return writeTransactionFromWalletPromise;
};
var readTransaction = async (dappToken, dappName, dappURL, dappIcon, channelName, chaincodeName, transactionName, transactionParams) => {
  const methodCallId = uuidv4();
  const methodName = METHODNAMES.READ_TRANSACTION;
  const methodArgs = [
    channelName,
    chaincodeName,
    transactionName,
    transactionParams
  ];
  const readTransactionFromWalletPromise = new Promise(
    (resolve, reject) => {
      const eventListenerFunction = async (event) => {
        try {
          const result = await handleReadTransaction(event);
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          windowWallet.removeEventListener(
            `kalp:${methodName}_` + dappToken + "_" + methodCallId,
            eventListenerFunction
          );
        }
      };
      windowWallet.addEventListener(
        `kalp:${methodName}_` + dappToken + "_" + methodCallId,
        eventListenerFunction
      );
    }
  );
  const functionObject = {
    dappToken,
    dappName,
    dappIcon,
    dappURL,
    methodArgs,
    methodCallId,
    methodName
  };
  const stringFunctionObject = JSON.stringify(functionObject);
  window.dispatchEvent(
    new CustomEvent(`kalp:${METHODNAMES.READ_TRANSACTION}`, { detail: stringFunctionObject })
  );
  return readTransactionFromWalletPromise;
};
var disconnect = async (dappToken, dappName, dappURL, dappIcon) => {
  const methodCallId = uuidv4();
  const methodName = METHODNAMES.DISCONNECT_WALLET;
  const methodArgs = [];
  const disconnectWalletPromise = new Promise((resolve, reject) => {
    const eventListenerFunction = async (event) => {
      try {
        const result = await handleDisconnectWallet(event);
        resolve(result);
      } catch (error) {
        reject(error);
      } finally {
        windowWallet.removeEventListener(
          `kalp:${methodName}_` + dappToken + "_" + methodCallId,
          eventListenerFunction
        );
      }
    };
    windowWallet.addEventListener(
      `kalp:${methodName}_` + dappToken + "_" + methodCallId,
      eventListenerFunction
    );
  });
  const functionObject = {
    dappToken,
    dappName,
    dappIcon,
    dappURL,
    methodArgs,
    methodCallId,
    methodName
  };
  const stringFunctionObject = JSON.stringify(functionObject);
  window.dispatchEvent(
    new CustomEvent(`kalp:${dappToken}`, { detail: stringFunctionObject })
  );
  return disconnectWalletPromise;
};
var handleConnectToWallet = (event) => {
  return new Promise((resolve, reject) => {
    console.log("event to connect", event);
    if (event !== null) {
      try {
        const eventDetail = JSON.parse(event.detail);
        console.log("erjbe", eventDetail);
        resolve(eventDetail);
      } catch (error) {
        reject(
          new Error(
            "Failed to parse event detail in handleConnectToWallet: " + error.message
          )
        );
      }
    } else {
      reject(new Error("Event is null in handleConnectToWallet"));
    }
  });
};
var handleReadTransaction = (event) => {
  return new Promise((resolve, reject) => {
    if (event !== null) {
      try {
        const eventDetail = JSON.parse(event.detail);
        resolve(eventDetail.output);
      } catch (error) {
        reject(
          new Error(
            "Failed to parse event detail in handleReadTransaction: " + error.message
          )
        );
      }
    } else {
      reject(new Error("Event is null in handleReadTransaction"));
    }
  });
};
var handleEnrollmentId = (event) => {
  return new Promise((resolve, reject) => {
    if (event !== null) {
      try {
        const eventDetail = JSON.parse(event.detail);
        console.log("eventDetail for enrollmentid", eventDetail);
        resolve(eventDetail.result?.enrollmentId);
      } catch (error) {
        reject(
          new Error(
            "Failed to parse event detail in handleEnrollmentId: " + error.message
          )
        );
      }
    } else {
      reject(new Error("Event is null in handleEnrollmentId"));
    }
  });
};
var handleWriteTransaction = (event) => {
  return new Promise((resolve, reject) => {
    if (event !== null) {
      try {
        const eventDetail = JSON.parse(event.detail);
        resolve(eventDetail.output);
      } catch (error) {
        reject(
          new Error(
            "Failed to parse event detail in handleWriteTransaction: " + error.message
          )
        );
      }
    } else {
      reject(new Error("Event is null in handleWriteTransaction"));
    }
  });
};
var handleDisconnectWallet = (event) => {
  return new Promise((resolve, reject) => {
    if (event !== null) {
      try {
        const eventDetail = JSON.parse(event.detail);
        resolve(eventDetail.output);
      } catch (error) {
        reject(
          new Error(
            "Failed to parse event detail in handleDisconnectWallet: " + error.message
          )
        );
      }
    } else {
      reject(new Error("Event is null in handleDisconnectWallet"));
    }
  });
};

// app.ts
var getToken = () => {
  try {
    const uuid = uuidv42();
    return uuid;
  } catch (error) {
    if (!(error instanceof CustomError)) {
      error = new InternalServerError("Failed to generate the token");
    }
    throw error;
  }
};
var connectToWallet = async (token, name, dappURL, dappIcon) => {
  try {
    if (!token) {
      token = getToken();
    }
    if (!name) {
      throw new ValidationError("Name is required");
    }
    const result = await registerDAppToken(token, name, dappURL, dappIcon);
    console.log("res", result);
    return result;
  } catch (error) {
    if (!(error instanceof CustomError)) {
      error = new InternalServerError("Failed to connect to wallet");
    }
    throw error;
  }
};
var reEngageEvents = async (token, name, dappURL, dappIcon) => {
  try {
    if (!token) {
      token = getToken();
    }
    if (!name) {
      throw new ValidationError("Name is required");
    }
    const result = await reEngagingEvents(token, name, dappURL, dappIcon);
    return result;
  } catch (error) {
    if (!(error instanceof CustomError)) {
      error = new InternalServerError("Failed to connect to wallet");
    }
    throw error;
  }
};
var getEnrollmentIdFromWallet = async (token, name, dappURL, dappIcon) => {
  try {
    if (!token) {
      throw new ValidationError("DappToken is required");
    }
    const result = await getEnrollmentId(token, name, dappURL, dappIcon);
    return result;
  } catch (error) {
    if (error instanceof CustomError) {
      console.error(
        `${error.timestamp} - Error: ${error.message} - Code: ${error.errorCode}`
      );
      throw error;
    } else {
      const internalError = new InternalServerError(
        "Failed to connect to wallet"
      );
      if (error instanceof Error) {
        console.error(
          `${internalError.timestamp} - Error: ${internalError.message} - Code: ${internalError.errorCode} - Original error: ${error.message}`
        );
      } else {
        console.error(
          `${internalError.timestamp} - Error: ${internalError.message} - Code: ${internalError.errorCode} - Original error: Unknown error`
        );
      }
      throw internalError;
    }
  }
};
var writeTransactionFromWallet = async (token, name, dappURL, dappIcon, channelName, chaincodeName, transactionName, transactionParams) => {
  try {
    if (!token) {
      throw new ValidationError(
        "DappToken is required in writeTransactionFromWallet"
      );
    }
    const result = await writeTransaction(
      token,
      name,
      dappURL,
      dappIcon,
      channelName,
      chaincodeName,
      transactionName,
      transactionParams
    );
    return result;
  } catch (error) {
    if (error instanceof CustomError) {
      console.error(
        `${error.timestamp} - Error: ${error.message} - Code: ${error.errorCode}`
      );
      throw error;
    } else {
      const internalError = new InternalServerError(
        "Failed to write transaction"
      );
      if (error instanceof Error) {
        console.error(
          `${internalError.timestamp} - Error: ${internalError.message} - Code: ${internalError.errorCode} - Original error: ${error.message}`
        );
      } else {
        console.error(
          `${internalError.timestamp} - Error: ${internalError.message} - Code: ${internalError.errorCode} - Original error: Unknown error`
        );
      }
      throw internalError;
    }
  }
};
var readTransactionFromWallet = async (token, name, dappURL, dappIcon, channelName, chaincodeName, transactionName, transactionParams) => {
  try {
    if (!token) {
      throw new ValidationError(
        "DappToken is required in readTransactionFromWallet"
      );
    }
    const result = await readTransaction(
      token,
      name,
      dappURL,
      dappIcon,
      channelName,
      chaincodeName,
      transactionName,
      transactionParams
    );
    return result;
  } catch (error) {
    if (error instanceof CustomError) {
      console.error(
        `${error.timestamp} - Error: ${error.message} - Code: ${error.errorCode}`
      );
      throw error;
    } else {
      const internalError = new InternalServerError(
        "Failed to read transaction"
      );
      if (error instanceof Error) {
        console.error(
          `${internalError.timestamp} - Error: ${internalError.message} - Code: ${internalError.errorCode} - Original error: ${error.message}`
        );
      } else {
        console.error(
          `${internalError.timestamp} - Error: ${internalError.message} - Code: ${internalError.errorCode} - Original error: Unknown error`
        );
      }
      throw internalError;
    }
  }
};
var disconnectWallet = async (token, name, dappURL, dappIcon) => {
  try {
    if (!token) {
      throw new Error("Error: no dappToken exists in package");
    }
    const result = await disconnect(token, name, dappURL, dappIcon);
    return result;
  } catch (error) {
    console.log(`error is :${error}`);
  }
};
export {
  connectToWallet,
  disconnectWallet,
  getEnrollmentIdFromWallet,
  getToken,
  reEngageEvents,
  readTransactionFromWallet,
  writeTransactionFromWallet
};
