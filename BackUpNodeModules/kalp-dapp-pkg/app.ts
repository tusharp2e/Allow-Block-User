import { v4 as uuidv4 } from "uuid";
import {
  CustomError,
  InternalServerError,
  ValidationError,
} from "./utils/errors";
import {
  disconnect,
  getEnrollmentId,
  readTransaction,
  registerDAppToken,
  writeTransaction,
  reEngagingEvents
} from "./connector";

const getToken = (): string => {
  try {
    const uuid = uuidv4();
    return uuid;
  } catch (error) {
    if (!(error instanceof CustomError)) {
      error = new InternalServerError("Failed to generate the token");
    }

    throw error;
  }
};

const connectToWallet = async (token: string, name: string, dappURL: string, dappIcon: string): Promise<boolean> => {
  try {
    if (!token) {
      token = getToken();
    }

    if (!name) {
      throw new ValidationError("Name is required");
    }

    const result = await registerDAppToken(token, name, dappURL, dappIcon);
    console.log("res", result)
    return result;
  } catch (error) {
    if (!(error instanceof CustomError)) {
      error = new InternalServerError("Failed to connect to wallet");
    }

    throw error;
  }
};

const reEngageEvents = async (token: string, name: string, dappURL: string, dappIcon: string): Promise<boolean> => {
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

const getEnrollmentIdFromWallet = async (token: string, name: string, dappURL: string, dappIcon: string): Promise<string | undefined> => {
  try {
    if (!token) {
      throw new ValidationError("DappToken is required");
    }

    const result = await getEnrollmentId(token, name, dappURL, dappIcon);

    return result;
  } catch (error) {
    if (error instanceof CustomError) {
      console.error(
        `${error.timestamp} - Error: ${error.message} - Code: ${error.errorCode}`,
      );
      throw error;
    } else {
      const internalError = new InternalServerError(
        "Failed to connect to wallet",
      );
      // Ensure `error` has a `message` property
      if (error instanceof Error) {
        console.error(
          `${internalError.timestamp} - Error: ${internalError.message} - Code: ${internalError.errorCode} - Original error: ${error.message}`,
        );
      } else {
        console.error(
          `${internalError.timestamp} - Error: ${internalError.message} - Code: ${internalError.errorCode} - Original error: Unknown error`,
        );
      }
      throw internalError;
    }
  }
};

const writeTransactionFromWallet = async (
  token: string, 
  name: string,
  dappURL: string, dappIcon: string,
  channelName: string,
  chaincodeName: string,
  transactionName: string,
  transactionParams: any[],
): Promise<any> => {
  try {
    if (!token) {
      throw new ValidationError(
        "DappToken is required in writeTransactionFromWallet",
      );
    }

    const result = await writeTransaction(
      token, 
      name,
      dappURL, dappIcon,
      channelName,
      chaincodeName,
      transactionName,
      transactionParams,
    );

    return result;
  } catch (error) {
    if (error instanceof CustomError) {
      console.error(
        `${error.timestamp} - Error: ${error.message} - Code: ${error.errorCode}`,
      );
      throw error;
    } else {
      const internalError = new InternalServerError(
        "Failed to write transaction",
      );
      // Ensure `error` has a `message` property
      if (error instanceof Error) {
        console.error(
          `${internalError.timestamp} - Error: ${internalError.message} - Code: ${internalError.errorCode} - Original error: ${error.message}`,
        );
      } else {
        console.error(
          `${internalError.timestamp} - Error: ${internalError.message} - Code: ${internalError.errorCode} - Original error: Unknown error`,
        );
      }
      throw internalError;
    }
  }
};

const readTransactionFromWallet = async (
  token: string, 
  name: string,
  dappURL: string, dappIcon: string,
  channelName: string,
  chaincodeName: string,
  transactionName: string,
  transactionParams: any[],
): Promise<any> => {
  try {
    if (!token) {
      throw new ValidationError(
        "DappToken is required in readTransactionFromWallet",
      );
    }

    const result = await readTransaction(
      token, 
      name,
      dappURL, dappIcon,
      channelName,
      chaincodeName,
      transactionName,
      transactionParams,
    );

    return result;
  } catch (error) {
    if (error instanceof CustomError) {
      console.error(
        `${error.timestamp} - Error: ${error.message} - Code: ${error.errorCode}`,
      );
      throw error;
    } else {
      const internalError = new InternalServerError(
        "Failed to read transaction",
      );
      // Ensure `error` has a `message` property
      if (error instanceof Error) {
        console.error(
          `${internalError.timestamp} - Error: ${internalError.message} - Code: ${internalError.errorCode} - Original error: ${error.message}`,
        );
      } else {
        console.error(
          `${internalError.timestamp} - Error: ${internalError.message} - Code: ${internalError.errorCode} - Original error: Unknown error`,
        );
      }
      throw internalError;
    }
  }
};


const disconnectWallet = async (token: string, name: string, dappURL: string, dappIcon: string): Promise<any> => {
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
  getToken,
  connectToWallet,
  getEnrollmentIdFromWallet,
  writeTransactionFromWallet,
  readTransactionFromWallet,
  disconnectWallet,
  reEngageEvents
};
