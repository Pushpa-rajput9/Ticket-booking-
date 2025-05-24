import React from "react";
import banner from "../../assets/1731587349DTO_2024_WebBanner_1920x600_(1).png";
function Home() {
  return (
    <div className="w-full flex justify-center">
      <div className="w-3/5 flex flex-col items-center mt-10 gap-10  ">
        <div className="top w-full bg-white rounded-xl p-5 flex flex-col gap-5">
          <img src={banner} className="w-full rounded-xl" alt="" />
          <div className=" text-gray-800 text-3xl font-medium mt-5 mb-5">
            Dare to Overcome 2024
          </div>
          <div className="flex justify-between w-full gap-5 mb-5">
            <div className="w-1/2 h-28 bg-slate-200 rounded-lg flex items-center gap-3 pl-10">
              <div>IC</div>
              <div>
                <div className="">Event Date</div>
                <div className=" text-gray-600 text-xl font-medium">
                  09 December, 2024
                </div>
                <div className=" text-gray-600">09:00 AM - 10:00 PM</div>
              </div>
            </div>
            <div className="w-1/2 h-28 bg-slate-200 rounded-lg flex items-center justify-evenly ">
              <div className="flex items-center gap-2 ">
                <div>Ic</div>
                <div>
                  <div className=" text-gray-600 text-xl font-medium">
                    New Delhi
                  </div>
                  <div className="text-gray-600 ">
                    {" "}
                    India Habitat Centre, New Delhi
                  </div>
                </div>
              </div>
              <div>LOc</div>
            </div>
          </div>
        </div>
        <div className="top w-full bg-white rounded-xl p-5 flex  gap-5">
          <div className=" w-3/4  bg-white rounded-xl p-5 "></div>
          <div className="w-1/4  bg-white rounded-xl p-5"></div>
        </div>
      </div>
    </div>
  );
}

export default Home;
