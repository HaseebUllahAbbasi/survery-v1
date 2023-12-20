import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
const CustomSelect = ({ options, selectedValues, onChange }) => {
  const renderOptions = (option, level) => {
    return (
      <React.Fragment key={option.value}>
        <option value={option.value}>
          {Array(level).fill("\u00a0\u00a0")}
          {option.label}
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

  // Options array
  const sectorOptions = [
    {
      value: "1",
      label: "Manufacturing",
    },
    {
      value: "19",
      label: "Construction materials",
    },
    {
      value: "18",
      label: "Electronics and Optics",
    },
    {
      value: "6",
      label: "Food and Beverage",
      children: [
        {
          value: "342",
          label: "Bakery & confectionery products",
        },
        {
          value: "43",
          label: "Beverages",
        },
        {
          value: "42",
          label: "Fish & fish products",
        },
        {
          value: "40",
          label: "Meat & meat products",
        },
        {
          value: "39",
          label: "Milk & dairy products",
        },
        {
          value: "437",
          label: "Other",
        },
        {
          value: "378",
          label: "Sweets & snack food",
        },
      ],
    },
    {
      value: "13",
      label: "Furniture",
      children: [
        {
          value: "389",
          label: "Bathroom/sauna",
        },
        {
          value: "385",
          label: "Bedroom",
        },
        {
          value: "390",
          label: "Children’s room",
        },
        {
          value: "98",
          label: "Kitchen",
        },
        {
          value: "101",
          label: "Living room",
        },
        {
          value: "392",
          label: "Office",
        },
        {
          value: "394",
          label: "Other (Furniture)",
        },
        {
          value: "341",
          label: "Outdoor",
        },
        {
          value: "99",
          label: "Project furniture",
        },
      ],
    },
    {
      value: "12",
      label: "Machinery",
      children: [
        {
          value: "94",
          label: "Machinery components",
        },
        {
          value: "91",
          label: "Machinery equipment/tools",
        },
        {
          value: "224",
          label: "Manufacture of machinery",
        },
        {
          value: "97",
          label: "Maritime",
          children: [
            {
              value: "271",
              label: "Aluminium and steel workboats",
            },
            {
              value: "269",
              label: "Boat/Yacht building",
            },
            {
              value: "230",
              label: "Ship repair and conversion",
            },
          ],
        },
        {
          value: "93",
          label: "Metal structures",
          children: [
            {
              value: "508",
              label: "Other",
            },
          ],
        },
        {
          value: "227",
          label: "Repair and maintenance service",
        },
      ],
    },
    // Continue adding more options...
  ];
  useEffect(() => {
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
    sessionStorage.setItem("name", name);
    sessionStorage.setItem("selectedSectors", JSON.stringify(selectedSectors));
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
          options={sectorOptions}
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
