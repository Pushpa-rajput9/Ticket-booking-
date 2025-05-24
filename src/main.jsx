import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  Route,
  createRoutesFromElements,
  createBrowserRouter,
  RouterProvider,
  createHashRouter,
} from "react-router-dom";
import Layout from "./Layout.jsx";
import "./index.css";
import Home from "./components/Home/Home.jsx";
import TicketBooking from "./components/TicketBoking/TicketBooking.jsx";
import Delegate from "./Delegate/Delegate.jsx";
import FreeTicket from "./FreeTicket/FreeTicket.jsx";
import { TicketProvider } from "./components/context/TicketContext.jsx";
import Details from "./components/TicketBoking/Details.jsx";
import RazorpayDemo from "./components/payment/RazorpayDemo.jsx";

const router = createHashRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      {/* <Route path="" element={<Home />} /> */}
      <Route path="" element={<TicketBooking />} />
      <Route path="delegate" element={<Delegate />} />
      <Route path="freeTicket" element={<FreeTicket />} />
      <Route path="Ticketbooking" element={<Details />} />
      <Route path="pay" element={<RazorpayDemo />} />
      {/* <Route path="*" element={<NotFound />} /> */}
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TicketProvider>
      {" "}
      <RouterProvider router={router}></RouterProvider>
    </TicketProvider>
  </StrictMode>
);
