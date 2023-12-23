import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { getSectors } from "./services/api/sector";
import { createUser, getUsers, updateUser } from "./services/api/user";
import Swal from "sweetalert2";

const CustomSelect = ({
  options,
  selectedValues,
  onChange = () => {
    return;
  },
  disabled = false,
}) => {
  const renderOptions = (option, level) => {
    return (
      <React.Fragment key={option._id}>
        <option value={option._id}>
          {Array(level).fill("\u00a0\u00a0")}
          {option.name}
        </option>
        {option.children &&
          option.children.length > 0 &&
          option.children.map((childItem) =>
            renderOptions(childItem, level + 1)
          )}
      </React.Fragment>
    );
  };

  const handleOptionChange = (event) => {
    const selectedOptions = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    onChange(selectedOptions);
  };

  return (
    <select
      className="w-full  border p-2 rounded-md focus:outline-none focus:ring focus:border-blue-300 transition duration-300"
      multiple
      size="5"
      value={selectedValues}
      onChange={handleOptionChange}
      disabled={disabled}
    >
      {options?.map((option) => renderOptions(option, 0))}
    </select>
  );
};

const App = () => {
  const [recordId, setRecordId] = useState();
  const [name, setName] = useState("");
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [sessionId, setSessionId] = useState("");
  const [users, setUsers] = useState([]);
  const [isChecked, setIsChecked] = useState(false);

  const [sectors, setSectors] = useState([]);
  const createNewSession = () => {
    setRecordId();
  };
  const fetchSectors = async () => {
    const sectors = await getSectors();
    setSectors(sectors);
  };
  const fetchUsers = async () => {
    const users = await getUsers();
    setUsers(users);
  };

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };
  useEffect(() => {
    fetchSectors();
    fetchUsers();
    const storedSessionId = sessionStorage.getItem("sessionId");

    const storedName = sessionStorage.getItem("name");
    const storedSelectedSectors = sessionStorage.getItem("selectedSectors");

    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      const newSessionId = uuidv4();
      setSessionId(newSessionId);
      sessionStorage.setItem("sessionId", newSessionId);
    }

    if (storedName) {
      setName(storedName);
    }

    if (storedSelectedSectors) {
      setSelectedSectors(JSON.parse(storedSelectedSectors));
    }
  }, []);
  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleSectorChange = (selectedOptions) => {
    setSelectedSectors(selectedOptions);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (recordId) {
      const record = await updateUser(
        recordId,
        name,
        selectedSectors,
        isChecked
      );
      if (record.success) {
        Swal.fire("Record Updated");
      }
      // console.log("update record");
    } else {
      const record = await createUser(name, selectedSectors, isChecked);
      setRecordId(record?.user._id);
      Swal.fire("Record created");
    }
    fetchUsers();
  };
  useEffect(() => {
    if (name) sessionStorage.setItem("name", name);
    if (selectedSectors.length > 0)
      sessionStorage.setItem(
        "selectedSectors",
        JSON.stringify(selectedSectors)
      );
  }, [name, selectedSectors]);

  return (
    <div className="p-4 md:p-8 lg:p-12 xl:p-16 bg-gradient-to-r from-blue-500 to-purple-500 h-[100vh]">
      <h1 className="text-2xl font-extrabold text-center text-gradient bg-clip-text from-pink-500 to-purple-700 leading-tight">
        <span className="block">
          Please enter your name and pick the Sectors you are currently involved
          in.
        </span>
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 shadow-md rounded-md transition duration-300 transform hover:shadow-lg"
      >
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Full Name:</label>
          <input
            className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 transition duration-300"
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="Mike"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Select Sectors:</label>
          <CustomSelect
            options={sectors}
            selectedValues={selectedSectors}
            onChange={handleSectorChange}
          />
        </div>
        <div className="mb-4 flex items-center">
          <input
            required
            checked={isChecked}
            onChange={handleCheckboxChange}
            type="checkbox"
            className="mr-2"
          />
          <span className="text-gray-700">
            I agree to the terms and conditions
          </span>
        </div>
        <div className="flex justify-around">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300 transition duration-300"
          >
            Save
          </button>

          {recordId && (
            <button
              onClick={createNewSession}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300 transition duration-300"
            >
              Create New Session
            </button>
          )}
        </div>
      </form>

      <div className="flex flex-wrap  mt-5">
        {users.map((user, index) => (
          <div key={index} className="lg:w-1/4 md:w-1/3 sm:w-1/2 w-full p-1 ">
            <div className=" cursor-pointer bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 my-1 shadow-md p-6 rounded-md duration-300 transform hover:shadow-lg hover:rounded-lg transition-all">
              <div className="text-xl font-semibold mb-4 text-center">
                {user.name}
              </div>
              <div className="text-center cursor-pointer">
                <CustomSelect
                  options={sectors}
                  selectedValues={user.sectors}
                  disabled={true}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
