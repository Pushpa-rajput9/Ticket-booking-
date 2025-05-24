import React, { useState } from "react";
import Delegate from "../../Delegate/Delegate.jsx";
import FreeTicket from "../../FreeTicket/FreeTicket";
import { useTicket } from "../context/TicketContext.jsx";
import { useNavigate } from "react-router-dom";
import forward from "../../assets/forward.svg";
function TicketBooking() {
  const { ticketCount, ticket2Count } = useTicket();
  // const DelegateTickets = parseInt(
  //   localStorage.getItem("ticketCount") || "0",
  //   10)
  // );
  // const freeTickets = parseInt(localStorage.getItem("ticket2Count") || "0", 10);
  // console.log(DelegateTickets, freeTickets);

  const navigate = useNavigate();
  const handleBookNow = () => {
    if (ticketCount > 0 || ticket2Count > 0) {
      navigate("/Ticketbooking");
    }
  };
  return (
    <div className="flex flex-col items-center pb-20 ">
      <div className=" w-3/5   border-b-[1px] border-gray-300  ">
        {" "}
        <h1 className=" text-3xl text-gray-800 pt-10 mb-3 font-medium">
          Jaipur Music Stage 2025
        </h1>
        <p className=" text-gray-500 mb-7 text-[17px]">
          30 January, 2025 - 1 February 2025 | Hotel Clerk, Jaipur
        </p>
      </div>
      <div className="w-3/5 flex  gap-5 pt-10 ">
        <div className="w-3/5 flex flex-col gap-5">
          {/* <div className="">
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
                <div className=" text-gray-500">
                  *** No refunds will be issued.
                </div>
                <div className="text-gray-800 text-lg mt-2 ">
                  {" "}
                  Starts From : ₹999.00
                </div>
              </div>
              <div className="w-fit bg-white h-10 rounded-xl gap-4 items-center text-gray-800 p-4 flex justify-center">
                {" "}
                <button
                  disabled={count === 0}
                  className=" text-xl"
                  onClick={HandleMinus}
                >
                  -
                </button>
                {count}{" "}
                <button className=" text-xl" onClick={HandleAdd}>
                  +
                </button>
              </div>
            </div>
          </div> */}

          <Delegate />
          <FreeTicket />
        </div>
        <div className="w-2/5">
          <div className="w-ful p-5 bg-white rounded-xl flex justify-center shadow shadow-gray-300">
            <button
              onClick={handleBookNow}
              className=" w-full h-14  font-medium  text-white bg-[#7a7a7a]  rounded-xl flex justify-center items-center"
            >
              Book Now <img className="w-10 h-10 " src={forward} alt="" />
            </button>
          </div>
          <div className="w-ful p-5  bg-gray-200 rounded-xl mt-5  ">
            <div className="w-fit rounded-full bg-red-600 py-1 px-4">Note</div>
            <p className=" text-gray-800 font-medium pt-3">
              {" "}
              Package Inclusions
            </p>
            <ul className=" flex flex-col gap-2  text-gray-600 text-sm  list-disc p-5 pt-3">
              <li>Access to all sessions at Stein Auditorium, IHC</li>
              <li>
                Access to the Awards Ceremony & Music Concert at Stein
                Auditorium, IHC
              </li>
              <li>Lunch, Dinner & Refreshments</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketBooking;
