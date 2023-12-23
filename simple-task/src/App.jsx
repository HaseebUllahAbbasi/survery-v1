import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { getSectors } from "./services/api/sector";
import { createUser, getUsers, updateUser } from "./services/api/user";
import Swal from "sweetalert2";

const CustomSelect = ({
  options,
  selectedValues,
  onChange = () => {
    alert("called ");
  },
  disabled = false,
}) => {
  const [selectedOptions, setSelectedOptions] = useState(selectedValues);

  const handleOptionChange = (event) => {
    const newlySelected = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );

    const updatedSelection = [...selectedOptions];

    newlySelected.forEach((newSelection) => {
      const option = options.find((opt) => opt._id === newSelection);
      if (
        option &&
        option.parent &&
        !updatedSelection.includes(option.parent)
      ) {
        updatedSelection.push(option.parent);
      }
    });

    // Update the state and call the onChange callback
    setSelectedOptions(updatedSelection);
    onChange(updatedSelection);
  };

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

  return (
    <select
      multiple
      size="5"
      value={selectedOptions}
      onChange={handleOptionChange}
      disabled={disabled}
      className="border p-2 rounded-md focus:outline-none focus:ring focus:border-blue-300 transition duration-300"
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
      const record = await updateUser(recordId, name, sectors, isChecked);
      if (record.success) {
        Swal.fire("Record Updated");
      }
      // console.log("update record");
    } else {
      const record = await createUser(name, sectors, isChecked);
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
    <div className="p-4 md:p-8 lg:p-12 xl:p-16">
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto mt-8 p-4 bg-white shadow-md rounded-md transition duration-300 transform hover:shadow-lg"
      >
        {" "}
        <label className="block mb-2">
          Name:
          <input
            className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:ring focus:border-blue-300 transition duration-300"
            type="text"
            value={name}
            onChange={handleNameChange}
          />
        </label>
        <br />
        <br />
        <label className="block mb-4">
          Sectors:
          <CustomSelect
            options={sectors}
            selectedValues={selectedSectors}
            onChange={handleSectorChange}
          />
        </label>
        <br />
        <br />
        <label>
          <input
            required
            checked={isChecked}
            onChange={handleCheckboxChange}
            type="checkbox"
            className="mr-2"
          />
          <span className="text-gray-700">Agree to terms</span>
        </label>
        <br />
        <br />
        <input
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300 transition duration-300"
          type="submit"
          value="Save"
        />
      </form>
      <div className="mt-8 space-y-4">
        {users.map((user, index) => (
          <div
            className="border p-4 bg-gray-100 rounded-md transition duration-300 transform hover:scale-105"
            key={index}
          >
            <div className="text-xl font-semibold">{user.name}</div>

            <CustomSelect
              options={sectors}
              selectedValues={user.sectors}
              disabled={true}
            ></CustomSelect>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
