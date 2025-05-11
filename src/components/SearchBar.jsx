import React, { Component } from "react";

const SearchBar = ({ placeholder, onSearch }) => {
  const handleInputChange = async (e) => {
    // e.preventDefault()
    const query = e.target.value;
    console.log(query);
    onSearch(query);
  };
  return (
    <div>
      <input
        type="text"
        className="form-control border-2 border-black bg-body-secondary"
        placeholder={placeholder}
        onChange={handleInputChange}
      ></input>
    </div>
  );
};

export default SearchBar;
