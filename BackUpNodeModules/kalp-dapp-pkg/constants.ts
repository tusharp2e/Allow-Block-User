const METHODNAMES = {
    CONNECT_TO_WALLET: "connectToWallet",
    GET_ENROLLMENTID: "getEnrollmentId",
    WRITE_TRANSACTION: "writeTransaction",
    READ_TRANSACTION: "readTransaction",
    DISCONNECT_WALLET: "disconnectWallet",
    REENGAGE_EVENTS: "reengageEvents"
}

const EVENT_LISTNER_REGISTER_TOPIC = "kalp:announceDAppToken"
const EVENT_DISPATCHER_CONNECT_TOPIC = "kalp:connectToWallet"

export {
    METHODNAMES,
    EVENT_LISTNER_REGISTER_TOPIC,
    EVENT_DISPATCHER_CONNECT_TOPIC
}