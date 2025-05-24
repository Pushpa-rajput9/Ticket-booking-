// src/components/context/TicketContext.jsx
import React, { createContext, useContext, useState } from "react";

const TicketContext = createContext();

export const TicketProvider = ({ children }) => {
  const [ticketCount, setTicketCount] = useState(0);
  const [ticket2Count, setTicket2Count] = useState(0);

  return (
    <TicketContext.Provider
      value={{ ticketCount, setTicketCount, ticket2Count, setTicket2Count }}
    >
      {children}
    </TicketContext.Provider>
  );
};

export const useTicket = () => useContext(TicketContext);

// import React, { createContext, useContext, useState, useEffect } from "react";

// const TicketContext = createContext();

// export const TicketProvider = ({ children }) => {
//   const [ticketCount, setTicketCount] = useState(0);
//   const [ticket2Count, setTicket2Count] = useState(0);

//   // Load on mount
//   useEffect(() => {
//     const savedTicket = localStorage.getItem("ticketCount");
//     const savedFreeTicket = localStorage.getItem("ticket2Count");

//     if (savedTicket !== null) setTicketCount(parseInt(savedTicket));
//     if (savedFreeTicket !== null) setTicket2Count(parseInt(savedFreeTicket));
//   }, []);

//   // Save when changed
//   useEffect(() => {
//     localStorage.setItem("ticketCount", ticketCount.toString());
//     localStorage.setItem("ticket2Count", ticket2Count.toString());
//   }, [ticketCount, ticket2Count]);

//   return (
//     <TicketContext.Provider
//       value={{
//         ticketCount,
//         setTicketCount,
//         ticket2Count,
//         setTicket2Count,
//       }}
//     >
//       {children}
//     </TicketContext.Provider>
//   );
// };

// export const useTicket = () => useContext(TicketContext);
