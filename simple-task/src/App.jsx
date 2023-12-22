import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { getSectors } from "./services/api/sector";
import { getUsers } from "./services/api/user";

const CustomSelect = ({ options, selectedValues, onChange }) => {
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
      multiple
      size="5"
      value={selectedValues}
      onChange={handleOptionChange}
    >
      {options?.map((option) => renderOptions(option, 0))}
    </select>
  );
};

const App = () => {
  // State for the form inputs
  const [name, setName] = useState("");
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [sessionId, setSessionId] = useState("");
  const [users, setUsers] = useState([]);
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

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Name:", name);
    console.log("Selected Sectors:", selectedSectors);
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
        <input type="checkbox" /> Agree to terms
      </label>
      <br />
      <br />
      <input type="submit" value="Save" />
    </form>
  );
};

export default App;
