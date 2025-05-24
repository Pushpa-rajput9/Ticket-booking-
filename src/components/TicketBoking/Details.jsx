import React, { useState, useCallback, useEffect } from "react";
import { useTicket } from "../context/TicketContext";
import { useDropzone } from "react-dropzone";
import { Country, State } from "country-state-city";
import down from "../../assets/down.svg";
import forward from "../../assets/forward.svg";
import { useNavigate } from "react-router-dom";
function Details() {
  const navigate = useNavigate();
  // const { ticketCount, ticket2Count } = useTicket();
  // Parse and fallback to 0 if null or invalid
  const DelegateTickets = parseInt(
    localStorage.getItem("ticketCount") || "0",
    10
  );
  const freeTickets = parseInt(localStorage.getItem("ticket2Count") || "0", 10);

  const defaultAttendee = () => ({
    name: "",
    email: "",
    age: "",
    occupation: "",
    organisation: "",
    mobile: "",
    country: "",
    state: "",
    days: [],
    image_path: null,
    imageURL: "",
  });

  const [Dattendees, setDAttendees] = useState(
    Array.from({ length: DelegateTickets }, () => defaultAttendee())
  );
  const [attendees, setAttendees] = useState(
    Array.from({ length: freeTickets }, () => defaultAttendee())
  );
  const [countries, setCountries] = useState([]);
  const [statesMap, setStatesMap] = useState({}); // keyed by country isoCode
  const [formErrors, setFormErrors] = useState([]);
  const [isValid, setIsValid] = useState();
  const [toggle, setToggle] = useState(
    Array.from({ length: DelegateTickets }, (_, index) => index === 0)
  );
  const [toggle2, setToggle2] = useState(
    Array.from({ length: freeTickets }, (_, index) => index === 0)
  );

  const price = 999;
  const price2 = 0;
  const couponDiscount = 500;

  const styles = {
    dropzone: {
      border: "2px dashed #cccccc",
      borderRadius: "10px",
      padding: "20px",
      textAlign: "center",
      cursor: "pointer",
      marginBottom: "20px",
    },
    preview: { marginTop: "20px", textAlign: "center" },
    image: { maxWidth: "100%", maxHeight: "300px" },
  };

  useEffect(() => {
    const allCountries = Country.getAllCountries();
    setCountries(allCountries);
  }, []);

  const handleAttendeeChange = (index, field, value, type = "free") => {
    const list = type === "free" ? [...attendees] : [...Dattendees];

    list[index][field] = value;

    // Update states if country changes
    if (field === "country") {
      list[index].state = "";
      const newStates = State.getStatesOfCountry(value);
      setStatesMap((prev) => ({ ...prev, [value]: newStates }));
    }

    type === "free" ? setAttendees(list) : setDAttendees(list);
  };

  const handleCheckboxChange = (index, day, type = "free") => {
    const list = type === "free" ? [...attendees] : [...Dattendees];
    const days = list[index].days;

    list[index].days = days.includes(day)
      ? days.filter((d) => d !== day)
      : [...days, day];

    type === "free" ? setAttendees(list) : setDAttendees(list);
  };

  const onDrop = (acceptedFiles, index, type = "free") => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      handleAttendeeChange(index, "image_path", file, type);
      handleAttendeeChange(index, "imageURL", reader.result, type);
    };
    reader.readAsDataURL(file);
  };

  const validateAttendees = (list, type) => {
    const errors = [];

    list.forEach((attendee, index) => {
      const error = {};

      if (!attendee.name.trim()) error.name = "Name is required";
      if (!attendee.email.trim()) error.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(attendee.email))
        error.email = "Invalid email";

      if (!attendee.age) error.age = "Age is required";
      if (!attendee.occupation) error.occupation = "Occupation is required";
      if (!attendee.organisation.trim())
        error.organisation = "Organisation is required";

      if (!attendee.mobile.trim()) error.mobile = "Mobile is required";
      else if (!/^\d{10}$/.test(attendee.mobile))
        error.mobile = "Enter a valid 10-digit mobile number";

      if (!attendee.country) error.country = "Country is required";
      //if (!attendee.state) error.state = "State is required";
      if (!attendee.image_path) error.image_path = "Image upload is required";
      if (!attendee.days.length)
        error.days = "At least one day must be selected";

      errors[index] = error;
    });

    return errors;
  };
  const runFormValidation = () => {
    const delegateErrors = validateAttendees(Dattendees, "delegate");
    const freeErrors = validateAttendees(attendees, "free");

    const hasErrors =
      delegateErrors.some((e) => Object.keys(e).length > 0) ||
      freeErrors.some((e) => Object.keys(e).length > 0);

    if (hasErrors) {
      setFormErrors({
        delegate: delegateErrors,
        free: freeErrors,
      });
      return false;
    }

    return true;
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    //const isValid = runFormValidation();
    setIsValid(runFormValidation());
    if (!isValid) return;

    // Proceed to backend
    console.log("Attendees (Free):", attendees);
    console.log("Attendees (Delegate):", Dattendees);
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayClick = async (e) => {
    e.preventDefault();
    setIsValid(runFormValidation());

    if (!isValid) return;
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load.");
      return;
    }

    const options = {
      key: "rzp_test_1DP5mmOlF5G5ag", // ✅ Razorpay's official test key — no login needed
      amount:
        (price2 * freeTickets + price * DelegateTickets - couponDiscount) * 100, // 10000 paise = ₹100
      currency: "INR",
      name: "Demo Corp",
      description: "Test Transaction",
      image: "https://razorpay.com/logo.svg", // Optional
      handler: function (response) {
        alert("✅ Payment Successful!");
        console.log("Payment ID:", response.razorpay_payment_id);
      },
      prefill: {
        name: "Test User",
        email: "test@example.com",
        contact: "9999999999",
      },
      notes: {
        address: "Test Address",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };
  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   const isValid = runFormValidation();
  //   if (!isValid) return;
  //   // Proceed to backend
  //   console.log("Attendees (Free):", attendees);
  //   console.log("Attendees (Delegate):", Dattendees);
  // };
  return (
    <div className=" flex flex-col items-center     text-gray-800">
      <div className=" w-3/4  max-[1414px]:w-4/5 max-md:pl-2 max-xl:pl-5 max-[1330px]:w-10/12 max-xl:w-full  border-b-[1px] border-gray-300  ">
        {" "}
        <h1 className=" text-3xl text-gray-800 pt-10 mb-3 font-medium">
          Jaipur Music Stage 2025
        </h1>
        <p className=" text-gray-500 mb-7 text-[17px]">
          30 January, 2025 - 1 February 2025 | Hotel Clerk, Jaipur
        </p>
      </div>
      <div className=" flex w-3/4 max-sm:p-0 max-[800px]:p-2 max-[1414px]:w-4/5 max-[1330px]:w-10/12 max-xl:w-full max-lg:flex max-lg:flex-col  bg-white gap-5 pl-5 pr-3 mt-10  rounded-xl">
        <div className="Left w-8/12  max-[1061px]:w-full  pt-5 rounded-xl">
          <div className=" text-blue-600 font-medium text-3xl mb-10  max-sm:pl-2">
            Enter Details
          </div>
          <div className=" flex flex-col items-center gap-10 w-full ">
            <form
              action=""
              className=" flex flex-col items-center gap-10 w-full"
              onSubmit={handleConfirm}
            >
              {DelegateTickets > 0 && (
                <div className="w-full p-10 bg-slate-200 max-[800px]:p-2 max-sm:p-4 max-sm:rounded-none rounded-xl flex flex-col gap-7">
                  <div className=" text-xl font-medium m-5 mb-0 ml-0 ">
                    Delegate Tickets :
                  </div>
                  {[...Array(DelegateTickets)].map((_, index) => {
                    const { getRootProps, getInputProps, isDragActive } =
                      useDropzone({
                        onDrop: (files) => onDrop(files, index, "delegate"),
                        accept: "image/*",
                      });

                    const currentCountry = Dattendees[index].country;
                    const states = statesMap[currentCountry] || [];

                    return (
                      <div key={index} className="w-full ">
                        <div className="w-full max-sm:w-full max-md: mb-5 h-10 pl-5 bg-slate-800 flex items-center justify-between pr-5 text-white text-xl font-medium  rounded-lg">
                          <div>Attendee {index + 1}</div>
                          <img
                            src={down}
                            alt=""
                            onClick={() => {
                              setToggle((prev) =>
                                prev.map((item, i) =>
                                  i === index ? !item : item
                                )
                              );
                            }}
                            className=" w-5 h-5"
                          />
                        </div>
                        <form
                          //  className={`${
                          //   index === 0 || toggle[index]
                          //     ? "p-5 max-sm:p-0 max-[800px]:p-2 bg-white max-sm:bg-slate-200 rounded-xl"
                          //     : "hidden"
                          // }`}
                          className={`${
                            toggle[index]
                              ? "p-5 max-sm:p-0 max-[800px]:p-2 w- justify-center bg-white max-sm:bg-slate-200 rounded-xl"
                              : "hidden"
                          }`}
                          onSubmit={handleConfirm}
                        >
                          <div className=" flex flex-col  w-fit ">
                            {/* Days Checkboxes */}
                            <div className="w-full flex  flex-col">
                              <div className="date w-full flex gap-5 items-center mb-5 mt-5">
                                {["30 Jan", "31 Jan", "1 Feb"].map((day) => (
                                  <label
                                    key={day}
                                    className="flex gap-2 items-center  "
                                  >
                                    <input
                                      type="checkbox"
                                      checked={Dattendees[
                                        index
                                      ]?.days?.includes(day)}
                                      onChange={() =>
                                        handleCheckboxChange(
                                          index,
                                          day,
                                          "delegate"
                                        )
                                      }
                                      className="w-4 h-4 "
                                    />
                                    {day}
                                  </label>
                                ))}
                              </div>
                              {formErrors.delegate?.[index]?.days && (
                                <p className="text-red-500 text-sm">
                                  {formErrors.delegate[index].days}
                                </p>
                              )}
                            </div>

                            <div className="flex flex-col  gap-5">
                              {/* Inputs */}
                              <div className="w-full flex flex-wrap max-[568px]:flex max-[568px]:flex-col max-[568px]:gap-5  gap-10 ">
                                <div>
                                  <label>
                                    Name<span className="text-red-600">*</span>
                                  </label>
                                  <br />
                                  <input
                                    type="text"
                                    value={Dattendees[index].name}
                                    onChange={(e) =>
                                      handleAttendeeChange(
                                        index,
                                        "name",
                                        e.target.value,
                                        "delegate"
                                      )
                                    }
                                    className="border-[1px] w-64 max-[568px]:w-11/12 mt-2 focus:outline-none border-gray-300 rounded p-2"
                                  />
                                  {formErrors.delegate?.[index]?.name && (
                                    <p className="text-red-500 text-sm">
                                      {formErrors.delegate?.[index].name}
                                    </p>
                                  )}
                                </div>
                                <div>
                                  <label>
                                    Age<span className="text-red-600">*</span>
                                  </label>
                                  <br />
                                  <select
                                    value={Dattendees[index].age}
                                    onChange={(e) =>
                                      handleAttendeeChange(
                                        index,
                                        "age",
                                        e.target.value,
                                        "delegate"
                                      )
                                    }
                                    className=" p-3  w-64 flex justify-center max-[568px]:w-11/12  text-gray-800  items-center border-[1px] rounded focus:outline-none  border-gray-300"
                                  >
                                    <option value="">select...</option>
                                    <option value="18-24">Ages 18-24</option>
                                    <option value="25-34">Ages 25-34</option>
                                    <option value="35-44">Ages 35-44</option>
                                    <option value="45-54">Ages 45-54</option>
                                    <option value="55-64">Ages 55-64</option>
                                    <option value="65 and Above">
                                      Ages 65 and Above
                                    </option>
                                  </select>
                                  {formErrors.delegate?.[index]?.age && (
                                    <p className="text-red-500 text-sm">
                                      {formErrors.delegate?.[index].age}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* More Inputs */}
                              <div className="w-full max-[568px]:flex max-[568px]:flex-col max-[568px]:gap-5 flex flex-wrap gap-10 ">
                                <div>
                                  <label>
                                    Occupation
                                    <span className="text-red-600">*</span>
                                  </label>
                                  <br />
                                  <select
                                    value={Dattendees[index].occupation}
                                    onChange={(e) =>
                                      handleAttendeeChange(
                                        index,
                                        "occupation",
                                        e.target.value,
                                        "delegate"
                                      )
                                    }
                                    className=" p-3  w-64 max-[568px]:w-11/12 flex justify-center  text-gray-800  items-center border-[1px] rounded focus:outline-none  border-gray-300"
                                  >
                                    <option value="">select...</option>
                                    <option value="Publisher">Publisher</option>
                                    <option value="Literary Agent">
                                      Literary Agent
                                    </option>
                                    <option value="Translator">
                                      Translator
                                    </option>
                                    <option value="Graphic Designer">
                                      Graphic Designer
                                    </option>
                                    <option value="Bookseller">
                                      Bookseller
                                    </option>
                                    <option value="Writer">Writer</option>
                                    <option value="Other">Other</option>
                                  </select>
                                  {formErrors.delegate?.[index]?.occupation && (
                                    <p className="text-red-500 text-sm">
                                      {formErrors.delegate?.[index].occupation}
                                    </p>
                                  )}
                                </div>
                                <div>
                                  <label>
                                    Organisation
                                    <span className="text-red-600">*</span>
                                  </label>
                                  <br />
                                  <input
                                    type="text"
                                    value={Dattendees[index].organisation}
                                    onChange={(e) =>
                                      handleAttendeeChange(
                                        index,
                                        "organisation",
                                        e.target.value,
                                        "delegate"
                                      )
                                    }
                                    className="border-[1px] w-64 max-[568px]:w-11/12 mt-2 focus:outline-none border-gray-300 rounded p-2"
                                  />
                                  {formErrors.delegate?.[index]
                                    ?.organisation && (
                                    <p className="text-red-500 text-sm">
                                      {
                                        formErrors.delegate?.[index]
                                          .organisation
                                      }
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="w-full max-[568px]:flex max-[568px]:flex-col max-[568px]:gap-5 flex flex-wrap gap-10">
                                <div>
                                  <label>
                                    Email<span className="text-red-600">*</span>
                                  </label>
                                  <br />

                                  <input
                                    type="email"
                                    value={Dattendees[index].email}
                                    onChange={(e) =>
                                      handleAttendeeChange(
                                        index,
                                        "email",
                                        e.target.value,
                                        "delegate"
                                      )
                                    }
                                    className="border-[1px] w-64 mt-2 max-[568px]:w-11/12 focus:outline-none border-gray-300 rounded p-2"
                                  />
                                  {formErrors.delegate?.[index]?.email && (
                                    <p className="text-red-500 text-sm">
                                      {formErrors.delegate?.[index].email}
                                    </p>
                                  )}
                                </div>
                                <div>
                                  <label>
                                    Mobile No.
                                    <span className="text-red-600">*</span>
                                  </label>
                                  <br />

                                  <input
                                    type="tel"
                                    value={Dattendees[index].mobile}
                                    onChange={(e) =>
                                      handleAttendeeChange(
                                        index,
                                        "mobile",
                                        e.target.value,
                                        "delegate"
                                      )
                                    }
                                    className="border-[1px] w-64 mt-2 max-[568px]:w-11/12 focus:outline-none border-gray-300 rounded p-2"
                                  />
                                  {formErrors.delegate?.[index]?.mobile && (
                                    <p className="text-red-500 text-sm">
                                      {formErrors.delegate?.[index].mobile}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Country & State */}
                              <div className="w-full max-[568px]:flex max-[568px]:flex-col max-[568px]:gap-5 flex flex-wrap gap-10 ">
                                <div>
                                  <label>
                                    Country
                                    <span className="text-red-600">*</span>
                                  </label>
                                  <br />
                                  <select
                                    value={Dattendees[index].country}
                                    onChange={(e) =>
                                      handleAttendeeChange(
                                        index,
                                        "country",
                                        e.target.value,
                                        "delegate"
                                      )
                                    }
                                    className=" p-3  w-64 max-[568px]:w-11/12 flex justify-center  text-gray-800  items-center border-[1px] rounded focus:outline-none  border-gray-300"
                                  >
                                    <option value="">Select Country...</option>
                                    {countries.map((c) => (
                                      <option key={c.isoCode} value={c.isoCode}>
                                        {c.name}
                                      </option>
                                    ))}
                                  </select>
                                  {formErrors.delegate?.[index]?.country && (
                                    <p className="text-red-500 text-sm">
                                      {formErrors.delegate?.[index].country}
                                    </p>
                                  )}
                                </div>
                                <div>
                                  <label>
                                    State<span className="text-red-600">*</span>
                                  </label>
                                  <br />
                                  <select
                                    value={Dattendees[index].state}
                                    onChange={(e) =>
                                      handleAttendeeChange(
                                        index,
                                        "state",
                                        e.target.value,
                                        "delegate"
                                      )
                                    }
                                    className=" p-3  w-64 max-[568px]:w-11/12 flex justify-center  text-gray-800  items-center border-[1px] rounded focus:outline-none  border-gray-300"
                                  >
                                    <option value="">
                                      Select State/Region...
                                    </option>
                                    {states.map((state) => (
                                      <option
                                        key={state.isoCode}
                                        value={state.name}
                                      >
                                        {state.name}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </div>

                            {/* Upload */}
                            <div className="pt-5">
                              <div className="flex  w-[552px] max-[568px]:w-full">
                                <label className="  ">
                                  Upload Image{" "}
                                  <span className="text-red-700 font-bold">
                                    *
                                  </span>
                                </label>
                              </div>
                              {formErrors.delegate?.[index]?.image_path && (
                                <p className="text-red-500 text-sm">
                                  {formErrors.delegate?.[index].image_path}
                                </p>
                              )}
                              <div className="flex ">
                                <div
                                  className=" w-[552px] max-[568px]:w-full "
                                  {...getRootProps()}
                                  style={styles.dropzone}
                                >
                                  <input {...getInputProps()} />
                                  {isDragActive ? (
                                    <p>Drop the image here ...</p>
                                  ) : (
                                    <p>
                                      Drag/Drop an image here, or click to
                                      select one
                                    </p>
                                  )}
                                  {Dattendees[index].imageURL && (
                                    <div style={styles.preview}>
                                      <img
                                        src={Dattendees[index].imageURL}
                                        alt="Uploaded"
                                        style={styles.image}
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    );
                  })}
                </div>
              )}
              {freeTickets > 0 && (
                <div className="w-full p-10 bg-slate-200 max-[800px]:p-2 max-sm:p-0 rounded-xl flex flex-col gap-7">
                  <div className=" text-xl font-medium m-5 mb-0 ml-0">
                    Free Ticket :
                  </div>
                  {[...Array(freeTickets)].map((_, index) => {
                    const { getRootProps, getInputProps, isDragActive } =
                      useDropzone({
                        onDrop: (files) => onDrop(files, index),
                        accept: "image/*",
                      });

                    const currentCountry = attendees[index].country;
                    const states = statesMap[currentCountry] || [];

                    return (
                      <div key={index} className="w-full  max-[568px]:pl-5">
                        <div className="w-full mb-5 h-10 pl-5 bg-slate-800 flex items-center justify-between pr-5 text-white text-xl font-medium  rounded-lg">
                          <div>Attendee {index + 1}</div>
                          <img
                            src={down}
                            alt=""
                            onClick={() => {
                              setToggle2((prev) =>
                                prev.map((item, i) =>
                                  i === index ? !item : item
                                )
                              );
                            }}
                            className=" w-5 h-5"
                          />
                        </div>
                        <form
                          className={`${
                            toggle2[index]
                              ? "p-5 max-sm:p-0 max-[800px]:p-2 bg-white max-sm:bg-slate-200 rounded-xl"
                              : "hidden"
                          }`}
                          onSubmit={handleConfirm}
                        >
                          {/* Days Checkboxes */}
                          <div className="w-full flex  flex-col">
                            <div className="date w-full flex gap-5 items-center mb-5 mt-5">
                              {["30 Jan", "31 Jan", "1 Feb"].map((day) => (
                                <label
                                  key={day}
                                  className="flex gap-2 items-center  "
                                >
                                  <input
                                    type="checkbox"
                                    checked={attendees[index]?.days?.includes(
                                      day
                                    )}
                                    onChange={() =>
                                      handleCheckboxChange(index, day, "free")
                                    }
                                    className="w-4 h-4"
                                  />
                                  {day}
                                </label>
                              ))}
                            </div>
                            {formErrors.free?.[index]?.days && (
                              <p className="text-red-500 text-sm">
                                {formErrors.free[index].days}
                              </p>
                            )}
                          </div>

                          <div className="flex flex-col gap-5">
                            {/* Inputs */}
                            <div className="w-full flex flex-wrap max-[568px]:flex max-[568px]:flex-col max-[568px]:gap-5  gap-10">
                              <div>
                                <label>
                                  Name<span className="text-red-600">*</span>
                                </label>
                                <br />
                                <input
                                  type="text"
                                  value={attendees[index].name}
                                  onChange={(e) =>
                                    handleAttendeeChange(
                                      index,
                                      "name",
                                      e.target.value
                                    )
                                  }
                                  className="border-[1px] w-64 max-[568px]:w-11/12 mt-2 focus:outline-none border-gray-300 rounded p-2"
                                />
                                {formErrors.free?.[index]?.name && (
                                  <p className="text-red-500 text-sm">
                                    {formErrors.free[index].name}
                                  </p>
                                )}
                              </div>
                              <div>
                                <label>
                                  Age<span className="text-red-600">*</span>
                                </label>
                                <br />
                                <select
                                  value={attendees[index].age}
                                  onChange={(e) =>
                                    handleAttendeeChange(
                                      index,
                                      "age",
                                      e.target.value
                                    )
                                  }
                                  className=" p-3  w-64 max-[568px]:w-11/12 flex justify-center  text-gray-800  items-center border-[1px] rounded focus:outline-none  border-gray-300"
                                >
                                  <option value="">select...</option>
                                  <option value="18-24">Ages 18-24</option>
                                  <option value="25-34">Ages 25-34</option>
                                  <option value="35-44">Ages 35-44</option>
                                  <option value="45-54">Ages 45-54</option>
                                  <option value="55-64">Ages 55-64</option>
                                  <option value="65 and Above">
                                    Ages 65 and Above
                                  </option>
                                </select>
                                {formErrors.free?.[index]?.age && (
                                  <p className="text-red-500 text-sm">
                                    {formErrors.free[index].age}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* More Inputs */}
                            <div className="w-full flex flex-wrap max-[568px]:flex max-[568px]:flex-col max-[568px]:gap-5  gap-10">
                              <div>
                                <label>
                                  Occupation
                                  <span className="text-red-600">*</span>
                                </label>
                                <br />
                                <select
                                  value={attendees[index].occupation}
                                  onChange={(e) =>
                                    handleAttendeeChange(
                                      index,
                                      "occupation",
                                      e.target.value
                                    )
                                  }
                                  className=" p-3 max-[568px]:w-11/12  w-64 flex justify-center  text-gray-800  items-center border-[1px] rounded focus:outline-none  border-gray-300"
                                >
                                  <option value="">select...</option>
                                  <option value="Publisher">Publisher</option>
                                  <option value="Literary Agent">
                                    Literary Agent
                                  </option>
                                  <option value="Translator">Translator</option>
                                  <option value="Graphic Designer">
                                    Graphic Designer
                                  </option>
                                  <option value="Bookseller">Bookseller</option>
                                  <option value="Writer">Writer</option>
                                  <option value="Other">Other</option>
                                </select>
                                {formErrors.free?.[index]?.occupation && (
                                  <p className="text-red-500 text-sm">
                                    {formErrors.free[index].occupation}
                                  </p>
                                )}
                              </div>
                              <div>
                                <label>
                                  Organisation
                                  <span className="text-red-600">*</span>
                                </label>
                                <br />
                                <input
                                  type="text"
                                  value={attendees[index].organisation}
                                  onChange={(e) =>
                                    handleAttendeeChange(
                                      index,
                                      "organisation",
                                      e.target.value
                                    )
                                  }
                                  className="border-[1px] w-64 max-[568px]:w-11/12 mt-2 focus:outline-none border-gray-300 rounded p-2"
                                />
                                {formErrors.free?.[index]?.organisation && (
                                  <p className="text-red-500 text-sm">
                                    {formErrors.free[index].organisation}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="w-full flex flex-wrap max-[568px]:flex max-[568px]:flex-col max-[568px]:gap-5  gap-10">
                              <div>
                                <label>
                                  Email<span className="text-red-600">*</span>
                                </label>
                                <br />

                                <input
                                  type="email"
                                  value={attendees[index].email}
                                  onChange={(e) =>
                                    handleAttendeeChange(
                                      index,
                                      "email",
                                      e.target.value
                                    )
                                  }
                                  className="border-[1px] max-[568px]:w-11/12 w-64 mt-2 focus:outline-none border-gray-300 rounded p-2"
                                />
                                {formErrors.free?.[index]?.email && (
                                  <p className="text-red-500 text-sm">
                                    {formErrors.free[index].email}
                                  </p>
                                )}
                              </div>
                              <div>
                                <label>
                                  Mobile No.
                                  <span className="text-red-600">*</span>
                                </label>
                                <br />

                                <input
                                  type="tel"
                                  value={attendees[index].mobile}
                                  onChange={(e) =>
                                    handleAttendeeChange(
                                      index,
                                      "mobile",
                                      e.target.value
                                    )
                                  }
                                  className="border-[1px] w-64 max-[568px]:w-11/12 mt-2 focus:outline-none border-gray-300 rounded p-2"
                                />
                                {formErrors.free?.[index]?.mobile && (
                                  <p className="text-red-500 text-sm">
                                    {formErrors.free[index].mobile}
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Country & State */}
                            <div className="w-full flex flex-wrap max-[568px]:flex max-[568px]:flex-col max-[568px]:gap-5  gap-10">
                              <div>
                                <label>
                                  Country<span className="text-red-600">*</span>
                                </label>
                                <br />
                                <select
                                  value={attendees[index].country}
                                  onChange={(e) =>
                                    handleAttendeeChange(
                                      index,
                                      "country",
                                      e.target.value
                                    )
                                  }
                                  className=" p-3  w-64 max-[568px]:w-11/12 flex justify-center  text-gray-800  items-center border-[1px] rounded focus:outline-none  border-gray-300"
                                >
                                  <option value="">Select Country...</option>
                                  {countries.map((c) => (
                                    <option key={c.isoCode} value={c.isoCode}>
                                      {c.name}
                                    </option>
                                  ))}
                                </select>
                                {formErrors.free?.[index]?.countries && (
                                  <p className="text-red-500 text-sm">
                                    {formErrors.free[index].countries}
                                  </p>
                                )}
                              </div>
                              <div>
                                <label>
                                  State<span className="text-red-600">*</span>
                                </label>
                                <br />
                                <select
                                  value={attendees[index].state}
                                  onChange={(e) =>
                                    handleAttendeeChange(
                                      index,
                                      "state",
                                      e.target.value
                                    )
                                  }
                                  className=" p-3 max-[568px]:w-11/12 w-64 flex justify-center  text-gray-800  items-center border-[1px] rounded focus:outline-none  border-gray-300"
                                >
                                  <option value="">
                                    Select State/Region...
                                  </option>
                                  {states.map((state) => (
                                    <option
                                      key={state.isoCode}
                                      value={state.name}
                                    >
                                      {state.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* Upload */}
                          <div className="pt-5">
                            <div className="flex justify-center w-[552px] max-[568px]:w-full">
                              <label className=" w-full ">
                                Upload Image{" "}
                                <span className="text-red-700 font-bold">
                                  *
                                </span>
                              </label>
                              <br />
                            </div>
                            {formErrors.free?.[index]?.image_path && (
                              <p className="text-red-500 text-sm">
                                {formErrors.free[index].image_path}
                              </p>
                            )}

                            <div className="flex justify-center w-[552px] max-[568px]:w-full">
                              <div
                                className=" w-[552px] max-[568px]:w-full "
                                {...getRootProps()}
                                style={styles.dropzone}
                              >
                                <input {...getInputProps()} />
                                {isDragActive ? (
                                  <p>Drop the image here ...</p>
                                ) : (
                                  <p>
                                    Drag/Drop an image here, or click to select
                                    one
                                  </p>
                                )}
                                {attendees[index].imageURL && (
                                  <div style={styles.preview}>
                                    <img
                                      src={attendees[index].imageURL}
                                      alt="Uploaded"
                                      style={styles.image}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="w-full flex justify-end">
                <button
                  type="submit"
                  onSubmit={handleConfirm}
                  className={`transition-colors duration-300 w-40 h-10 bg-blue-600 text-white flex justify-center items-center rounded font-medium  mb-5${
                    isValid === false ? " animate-flashRed" : "bg-blue-600"
                  }`}
                >
                  {isValid === true ? "Edit" : "Continue"}
                  <img className="w-10 h-10 " src={forward} alt="" />
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="Right w-4/12 max-[800px]:w-full h-[410px] p-3 rounded-xl mt-3 bg-gray-200 flex flex-col gap-3">
          <form action="" className=" flex gap-3 items-center  mt-3">
            <input
              type="text"
              placeholder="Enter coupon code"
              className="w-full h-10 focus:outline-none pl-2 "
            />
            <button type="submit" className=" font-medium text-blue-600">
              APPLY
            </button>
          </form>
          <div className=" text-blue-600 font-medium">Order Summary</div>
          <div className=" flex justify-between text-gray-600">
            <div>Delegate ticket x {DelegateTickets}</div>
            <div>₹{price * DelegateTickets}</div>
          </div>
          <div className=" flex justify-between text-gray-600">
            <div>Free ticket x {freeTickets}</div>
            <div>₹{price2 * freeTickets}</div>
          </div>
          <hr className="w-full h-[2px] bg-slate-600" />
          <div className=" flex justify-between w-full text-gray-600">
            <div>Discount</div>
            <div>- ₹{couponDiscount}</div>
          </div>
          <div className=" flex justify-between text-gray-600">
            <div>Total</div>
            <div>
              ₹{price2 * freeTickets + price * DelegateTickets - couponDiscount}
            </div>
          </div>

          <hr className="w-full h-[2px] bg-slate-600" />
          <form
            action=""
            onSubmit={handlePayClick}
            className="flex justify-center w-full flex-col items-center gap-4 mb-10"
          >
            <div>Total Tickets: {freeTickets + DelegateTickets}</div>
            <button
              type="submit"
              onSubmit={handlePayClick}
              className="w-4/5 h-10 bg-blue-600 text-white flex justify-center items-center rounded font-medium mb-10"
            >
              Book Now <img className="w-10 h-10  " src={forward} alt="" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Details;
