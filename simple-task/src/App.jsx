import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { getSectors } from "./services/api/sector";
import { createUser, getUsers, updateUser } from "./services/api/user";
import Swal from "sweetalert2";

const CustomSelect = ({ options, selectedValues, onChange = () => {} }) => {
  const [selectedOptions, setSelectedOptions] = useState(selectedValues);

  const handleOptionChange = (event) => {
    const newlySelected = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );

    const updatedSelection = [...selectedOptions];

    // Check if any child is selected, then also select its parent
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
    >
      {options?.map((option) => renderOptions(option, 0))}
    </select>
  );
};

const App = () => {
  // State for the form inputs
  const [recordId, setRecordId] = useState();
  const [name, setName] = useState("");
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [sessionId, setSessionId] = useState("");
  const [users, setUsers] = useState([]);
  const [isChecked, setIsChecked] = useState(false);

  const [sectors, setSectors] = useState([]);
  // Options array

  const fetchSectors = async () => {
    const sectors = await getSectors();
    setSectors(sectors);
  };
  const fetchUsers = async () => {
    const users = await getUsers();
    setUsers(users);
  };

  const handleCheckboxChange = (event) => {
    // Update the state with the new checked status
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
      // If no session ID exists, create a new one
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
    <React.Fragment>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={name} onChange={handleNameChange} />
        </label>
        <br />
        <br />
        <label>
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
          />
          Agree to terms
        </label>
        <br />
        <br />
        <input type="submit" value="Save" />
      </form>
      <div>
        {users.map((user, index) => (
          <div style={{ border: "1px solid black" }} key={index}>
            {JSON.stringify(user)}
            <CustomSelect
              options={sectors}
              selectedValues={user.sectors}
            ></CustomSelect>
          </div>
        ))}
      </div>
    </React.Fragment>
  );
};

export default App;
