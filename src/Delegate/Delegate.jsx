import { useTicket } from "../components/context/TicketContext.jsx";
import { useState } from "react";
function Delegate() {
  const { ticketCount, setTicketCount } = useTicket(); // Access global state
  // const [ticketCount, setTicketCount] = useState(0);

  const HandleAdd = () => {
    const newCount = ticketCount + 1;
    setTicketCount(newCount);
    localStorage.setItem("ticketCount", newCount); // update localStorage
  };

  const HandleMinus = () => {
    const newCount = ticketCount > 0 ? ticketCount - 1 : 0;
    setTicketCount(newCount);
    localStorage.setItem("ticketCount", newCount); // update localStorage
  };
  return (
    <div className="">
      <div className="text-xl text-gray-800  font-medium">Delegate</div>
      <div className=" flex gap-5 bg-gray-200 rounded-xl w-full p-5 mt-5 items-center">
        <div>
          <div className="text-gray-800 text-lg">Delegate</div>
          <div className=" text-gray-500 mt-4">
            * Ticket price Includes Taxes as applicable
          </div>
          <div className=" text-gray-500">
            ** Internet / Online transaction charges may be levied
          </div>
          <div className=" text-gray-500">*** No refunds will be issued.</div>
          <div className="text-gray-800 text-lg mt-2 ">
            {" "}
            Starts From : ₹999.00
          </div>
        </div>
        <div className="w-fit bg-white h-10 rounded-xl gap-4 items-center text-gray-800 p-4 flex justify-center">
          {" "}
          <button className=" text-xl" onClick={HandleMinus}>
            -
          </button>
          {ticketCount}{" "}
          <button className=" text-xl" onClick={HandleAdd}>
            +
          </button>
        </div>
      </div>
    </div>
  );
}

export default Delegate;
