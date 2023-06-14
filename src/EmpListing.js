import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const EmpListing = () => {
  const [empdata, empdatachange] = useState(null);
  const [searchId, setSearchId] = useState("");
  const navigate = useNavigate();

  const LoadDetail = (id) => {
    navigate(`/employee/detail/${id}`);
  };

  const LoadEdit = (id) => {
    navigate(`/employee/edit/${id}`);
  };

  const Removefunction = (id) => {
    if (window.confirm("Do you want to remove?")) {
      fetch(`http://localhost:8000/employee/${id}`, {
        method: "DELETE",
      })
        .then((res) => {
          alert("Removed successfully.");
          window.location.reload();
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
  };

 const searchEmployee = () => {
  if (searchId.trim() !== "") {
    fetch(`http://localhost:8000/employee/${searchId}`)
      .then((res) => {
        if (res.status === 404) {
          throw new Error("Employee not found");
        }
        return res.json();
      })
      .then((data) => {
        empdatachange([data]);
      })
      .catch((err) => {
        empdatachange(null);
        alert(err.message);
      });
  } else {
    alert("Please enter an Employee ID.");
  }
};

  const resetSearch = () => {
    setSearchId("");
    fetchEmployeeData();
  };

  const fetchEmployeeData = () => {
    fetch("http://localhost:8000/employee")
      .then((res) => res.json())
      .then((data) => {
        empdatachange(data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  return (
    <div className="container">
      <div className="card">
        <div className="card-title">
          <h2>Employee Details:</h2>
        </div>
        <div className="card-body">
          <div className="divbtn">
            <Link to="/employee/create" className="btn btn-success">
              Add New (+)
            </Link>
          </div>
          <div className="search-container">
            <input
              type="text"
              placeholder="Enter Employee ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <button className="btn btn-primary" onClick={searchEmployee}>
              Search
            </button>
            <button className="btn btn-secondary" onClick={resetSearch}>
              Reset
            </button>
          </div>
          <br/>
          <table className="table table-bordered">
            <thead className="bg-dark text-white">
              <tr>
                <td>ID</td>
                <td>Name</td>
                <td>Email</td>
                <td>Phone</td>
                <td>Action</td>
              </tr>
            </thead>
            <tbody>
              {empdata && empdata.length > 0 ? (
                empdata.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item.phone}</td>
                    <td>
                      <button
                        onClick={() => LoadEdit(item.id)}
                        className="btn btn-success"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => Removefunction(item.id)}
                        className="btn btn-danger"
                      >
                        Remove
                      </button>
                      <button
                        onClick={() => LoadDetail(item.id)}
                        className="btn btn-primary"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No Employee Record</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EmpListing;
