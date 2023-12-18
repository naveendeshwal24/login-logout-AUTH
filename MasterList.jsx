import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import "../Styles/MasterList.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLinkedin,
  faInstagram,
  faFacebook,
} from "@fortawesome/free-brands-svg-icons";
import logo from "../Assets/logo-3.gif"; //importing image

const MasterList = () => {
  const initialFilters = { name: "", gender: "", state: "" };
  const [filteredData, setFilteredData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showNoRecordsPopup, setShowNoRecordsPopup] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    fetchData();
  }, []);
  //fetching the records from the URL to show in MasterList
  const fetchData = async () => {
    const APIURL = `http://62.171.153.83:8080/UserRegistrationForm/user/search1`;
    // const APIURL = `http://65.20.74.140:8080/ReactJsGoogleMapWeb/api/users`;
    try {
      const response = await fetch(APIURL);
      const responseData = await response.json();

      const data = Array.isArray(responseData.data.users)
        ? responseData.data.users
        : [responseData.data.users];
      console.log(data);
      setOriginalData(data);
      setFilteredData(data);
      //check status
      if (data.ok) {
        console.log("records fetched sucessfully");
      } else {
        console.log("error fetching the records", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleSearch = () => {
    // Performing data filtering based on values
    const filteredResults = originalData.filter((data) => {
      const nameMatch = data.name
        .toLowerCase()
        .includes(filters.name.toLowerCase());
      const genderMatch =
        filters.gender === "" ||
        data.gender.toLowerCase() === filters.gender.toLowerCase();
      const stateMatch = filters.state === "" || data.state === filters.state;

      return nameMatch && genderMatch && stateMatch;
    });
    setFilteredData(filteredResults);

    // Show popup if no records are found
    setShowNoRecordsPopup(filteredResults.length === 0);

    // Reset current page to 1 after filtering
    setCurrentPage(1);
  };

  const closeNoRecordsPopup = () => {
    setShowNoRecordsPopup(false);
  };
  //rendirecting the EditList component along with the ID
  const handleEditClick = (id) => {
    console.log(id); //test3
    navigate(`/EditList/${id}`);
  };
  //delete funcitonlity for specific records

  const handleDeleteClick = async (id) => {
    const APIURL = `http://62.171.153.83:8080/UserRegistrationForm/user/${id}`;
    try {
      const response = await fetch(APIURL, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        // Delete successful, updating the state or refetch data
        fetchData();
        alert("Record deleted successfully");
      } else {
        console.error("Error deleting record");
      }
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const handleLogOut = () => {
    navigate("/LandingPage");
  };
  return (
    <div>
      <header className="registrationform-header">
        <div class="logo-container">
          <img src={logo} alt="logo" />
        </div>
        <nav>
          <ul>
            <li>
              <Link to="/LandingPage">Home</Link>
            </li>
            <li>
              <Link to="/LandingPage">About</Link>
            </li>
            <li>
              <Link to="/RegistrationForm">List</Link>
            </li>
          </ul>
        </nav>
        <div class="buttons-container">
          <button onClick={handleLogOut}>LogOut</button>
        </div>
      </header>
      <div className="container">
        <label> Filters</label>
        <input
          type="text"
          name="name"
          value={filters.name}
          onChange={handleFilterChange}
          placeholder="Enter Employee name"
        />

        <select
          name="gender"
          value={filters.gender}
          onChange={handleFilterChange}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <select
          name="state"
          value={filters.state}
          onChange={handleFilterChange}
        >
          <option value="">Select State</option>
          <option value="Uttar Pradesh">Uttar Pradesh</option>
          <option value="Delhi">Delhi</option>
          <option value="Rajasthan">Rajasthan</option>
        </select>

        <button id="btnsrc" onClick={handleSearch}>
          Search
        </button>
      </div>

      <div className="tableContainer">
        <h2>List of Registered Users</h2>
        <table border="1">
          <thead>
            <tr>
              <th>Reg. No.</th>
              <th>Photo</th>
              <th>Name</th>
              <th>Gender</th>
              <th>State</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan="5">No records found</td>
              </tr>
            ) : (
              currentItems.map((data) => (
                <tr key={data && data.id}>
                  <td>{data && data.id}</td>
                  <td>
                    <img
                      src={
                        data &&
                        data.productImages &&
                        data.productImages.imageUrl
                      }
                      alt={`Photo of ${data && data.name}`}
                      style={{ width: "50px", height: "50px" }}
                    />
                  </td>
                  <td>{data && data.name ? data.name : "N/A"}</td>
                  <td>{data && data.gender ? data.gender : "N/A"}</td>
                  <td>{data && data.state ? data.state : "N/A"}</td>
                  <td>
                    {/* creating a conditional rendring based on action */}
                    <button
                      type="button"
                      onClick={() => handleEditClick(data.id)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteClick(data.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div>
        {/* Applying paging to the data  */}
        {/* <p id="pagination-bar">
          Showing {indexOfFirstItem + 1} to{" "}
          {Math.min(indexOfLastItem, filteredData.length)} of{" "}
          {filteredData.length} records
        </p> */}
        {/* <ul className="pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <li
              key={page}
              onClick={() => handlePageChange(page)}
              className={page === currentPage ? "active" : ""}
            >
              {page}
            </li>
          ))}
        </ul> */}
      </div>

      {showNoRecordsPopup && (
        <div className="popup">
          <p>No records found.</p>
          <button onClick={closeNoRecordsPopup}>Close</button>
        </div>
      )}
      <footer className="login-footer">
        <div className="login-footer-content">
          <div className="social-icons">
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faFacebook} />
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faInstagram} />
            </a>
            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MasterList;
