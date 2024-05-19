import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [error, setError] = useState(false);

  useEffect(() => {
    axios.get('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching the data', error);
        setError(true);
      });
  }, []);

  if (error) {
    return <div>Failed to fetch data</div>;
  }

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const nextPage = () => {
    if (currentPage < Math.ceil(data.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="container">
      <h1 style={{
        display:"flex",
        justifyContent:"space-around"
      }} className="my-4 text-center">Employee Data Table</h1>
      <Table data={currentItems} />
      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={data.length}
        currentPage={currentPage}
        paginate={paginate}
        nextPage={nextPage}
        prevPage={prevPage}
      />
    </div>
  );
};

const Table = ({ data }) => (
  <table className="table">
    <thead>
      <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Email</th>
        <th>Role</th>
      </tr>
    </thead>
    <tbody>
      {data.map(item => (
        <tr key={item.id}>
          <td>{item.id}</td>
          <td>{item.name}</td>
          <td>{item.email}</td>
          <td>{item.role}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const Pagination = ({ itemsPerPage, totalItems, currentPage, paginate, nextPage, prevPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination">
      <button
        className="page-button"
        onClick={prevPage}
        disabled={currentPage === 1}
      >
        Previous
      </button>
      {pageNumbers.map(number => (
        <button
          key={number}
          className={`page-button ${number === currentPage ? 'active' : ''}`}
          onClick={() => paginate(number)}
        >
          {number}
        </button>
      ))}
      <button
        className="page-button"
        onClick={nextPage}
        disabled={currentPage === pageNumbers.length}
      >
        Next
      </button>
    </div>
  );
};

export default App;
