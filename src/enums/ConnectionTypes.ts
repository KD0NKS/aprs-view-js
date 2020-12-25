/*
export const ConnectionTypes = {
    IS_SOCKET: Symbol("APRS IS") 
};

export default ConnectionTypes;


console.log(ConnectionTypes.IS_SOCKET.description); // 'APRS IS'
console.log(ConnectionTypes.IS_SOCKET.toString()) // 'Symbol(Aprs IS)''
*/

// TODO: Can this be done with the symbols?  Initial tests failed with the value on the select menu.
export enum ConnectionTypes {
    IS_SOCKET = 'APRS IS'
}