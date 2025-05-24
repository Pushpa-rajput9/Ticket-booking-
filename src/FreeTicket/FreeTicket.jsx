import { useTicket } from "../components/context/TicketContext.jsx";
import { useState } from "react";
function FreeTicket() {
  const { ticket2Count, setTicket2Count } = useTicket(); // Access global state
  // const [ticket2Count, setTicket2Count] = useState(0);

  const HandleAdd = () => {
    const newCount = ticket2Count + 1;
    setTicket2Count(newCount);
    localStorage.setItem("ticket2Count", newCount); // update localStorage
  };

  const HandleMinus = () => {
    const newCount = ticket2Count > 0 ? ticket2Count - 1 : 0;
    setTicket2Count(newCount);
    localStorage.setItem("ticket2Count", newCount); // update localStorage
  };

  return (
    <div className="">
      <div className="text-xl text-gray-800  font-medium">Free</div>
      <div className=" flex gap-5 bg-gray-200 rounded-xl w-full p-5 mt-5 items-center">
        <div>
          <div className="text-gray-800 text-lg">Free</div>
          <div className=" text-gray-500 mt-4">
            * Ticket price Includes Taxes as applicable
          </div>
          <div className=" text-gray-500">
            ** Internet / Online transaction charges may be levied
          </div>
          <div className=" text-gray-500">*** No refunds will be issued.</div>
          <div className="text-gray-800 text-lg mt-2 ">
            {" "}
            Starts From : ₹0.00
          </div>
        </div>
        <div className="w-fit bg-white h-10 rounded-xl gap-4 items-center text-gray-800 p-4 flex justify-center">
          {" "}
          <button className=" text-xl" onClick={HandleMinus}>
            -
          </button>
          {ticket2Count}
          <button className=" text-xl" onClick={HandleAdd}>
            +
          </button>
        </div>
      </div>
    </div>
  );
}

export default FreeTicket;
