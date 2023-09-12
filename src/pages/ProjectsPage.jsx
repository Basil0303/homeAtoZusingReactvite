import React from "react";
import { apiCall } from "../Services/ApiCall";
import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import { handleSubmit } from "../utils/Fns";
import { ProjectUrl } from "../Services/baseUrl";

function ProjectsPage() {
  {
    const [validated, setValidated] = useState(false);

    const [params, setparams] = useState({
      page: 1,
      limit: 10,
      query: "",
    });

    const [pagination, setpagination] = useState({
      hasNextPage: false,
      hasPreviousPage: false,
      totalDocs: 0,
    });

    const [data, setData] = useState({
      name: "",
      location: "",
      featured: "",
      popular: "",
      description: "",
      amnities: "",
    });

    const [list, setlist] = useState();

    useEffect(() => {
      initApis();
    }, [params]);

    const initApis = async () => {
      getPackages();
    };

    const getPackages = async () => {
      const response = await apiCall("get", ProjectUrl, { params });
      const { hasNextPage, hasPreviousPage, totalDocs, docs } = response?.data;
      setlist(docs ?? []);
      setpagination({ hasNextPage, hasPreviousPage, totalDocs });
    };
    const [show, setShow] = useState(false);

    //add data
    const project = async () => {
      const response = await apiCall("post", ProjectUrl, { data });
      console.log(response);
      getProject();
      setShow(false);
    };

    //edit data

    const [edit, setEdit] = useState(false);

    const handleClos = () => setEdit(false);

    const [editedItem, setEditedItem] = useState({
      id: "",
      name: "",
      location: "",
      featured: false, // Initialize as false
      popular: false, // Initialize as false
    });

    const handleFieldChange = (event) => {
      const { name, value, type, checked } = event.target;

      // Check if the input is a checkbox
      if (type === "checkbox") {
        setEditedItem((prevItem) => ({
          ...prevItem,
          [name]: checked, // Update with the checked value
        }));
      } else {
        // For non-checkbox inputs (e.g., text inputs)
        setEditedItem((prevItem) => ({
          ...prevItem,
          [name]: value,
        }));
      }
    };

    const EditData = (item) => {
      setEditedItem({
        id: item._id,
        name: item.name,
        location: item.location,
        featured: item.featured, // Initialize with the project's value
        popular: item.popular, // Initialize with the project's value
      });
      setEdit(true);
    };

    const handleEdit = async () => {
      await apiCall("put", `${ProjectUrl}/${editedItem.id}`, {
        data: editedItem,
      });

      // Find the index of the edited item in the list
      const editedItemIndex = list.findIndex(
        (item) => item._id === editedItem.id
      );

      // Create a copy of the list with the edited item replaced
      const updatedList = [...list];
      updatedList[editedItemIndex] = editedItem;

      // Update the list state with the updated list
      setlist(updatedList);

      handleClose();
    };

    //delete data from table
    const handleDelete = async () => {
      const response = await apiCall("delete", `${ProjectUrl}/${remove.id}`, {
        data,
      });
      console.log("Item deleted:", response);
      setRemove({ show: false, id: null });
      getProject();
    };

    //get data
    const getProject = async () => {
      const response = await apiCall("get", ProjectUrl, { params });
      const { hasNextPage, hasPreviousPage, totalDocs, docs } = response?.data;
      setlist(docs ?? []);
      setpagination({ hasNextPage, hasPreviousPage, totalDocs });
      console.log(response);
    };

    const handleClose = () => setShow(false);

    const [remove, setRemove] = useState({
      show: false,
      id: null,
    });

    const handleCloses = () => setRemove(false);

    //amnities option
    const amnities = [
      { value: "option1", label: "Option 1" },
      { value: "option2", label: "Option 2" },
      // Add more options as needed
    ];

    return (
      <div>
        <div className="col-xl-12">
          <div className="card dz-card" id="bootstrap-table11">
            <div className="card-header flex-wrap d-flex justify-content-between">
              <div>
                <h4 className="card-title">Projects Table</h4>
              </div>

              <div
                className="nav nav-tabs dzm-tabs d-flex align-items-center"
                id="myTab-8"
                role="tablist"
                style={{ backgroundColor: "white" }}
              >
                <li className="nav-item me-1">
                  <div className="input-group search-area">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search here..."
                      value={params.query}
                      onChange={(e) =>
                        setparams({ ...params, query: e.target.value })
                      }
                    />

                    <span className="input-group-text">
                      <a href={undefined}>
                        <svg
                          width={24}
                          height={24}
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#clip0_1_450)">
                            <path
                              opacity="0.3"
                              d="M14.2929 16.7071C13.9024 16.3166 13.9024 15.6834 14.2929 15.2929C14.6834 14.9024 15.3166 14.9024 15.7071 15.2929L19.7071 19.2929C20.0976 19.6834 20.0976 20.3166 19.7071 20.7071C19.3166 21.0976 18.6834 21.0976 18.2929 20.7071L14.2929 16.7071Z"
                              fill="#452B90"
                            />
                            <path
                              d="M11 16C13.7614 16 16 13.7614 16 11C16 8.23859 13.7614 6.00002 11 6.00002C8.23858 6.00002 6 8.23859 6 11C6 13.7614 8.23858 16 11 16ZM11 18C7.13401 18 4 14.866 4 11C4 7.13402 7.13401 4.00002 11 4.00002C14.866 4.00002 18 7.13402 18 11C18 14.866 14.866 18 11 18Z"
                              fill="#452B90"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_1_450">
                              <rect width={24} height={24} fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                      </a>
                    </span>
                  </div>
                </li>

                <li className="nav-item ms-1">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setShow(true);
                    }}
                    className="btn btn-sm btn-primary form-control"
                  >
                    <i className="fa fa-plus" aria-hidden="true" />
                  </button>
                </li>
              </div>
            </div>

            <div className="tab-content" id="myTabContent-8">
              <div
                className="tab-pane fade show active"
                id="activebackground"
                role="tabpanel"
                aria-labelledby="home-tab-8"
              >
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table header-border table-responsive-sm">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Name</th>
                          <th>Location</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {!list ? (
                          <tr>
                            <td colSpan={5} className="text-center py-4">
                              <div className="spinner-border" role="status">
                                <span className="sr-only">Loading...</span>
                              </div>
                            </td>
                          </tr>
                        ) : list?.length ? (
                          <>
                            {list.map((item, key) => (
                              <tr key={item._id}>
                                <td>
                                  <ul>
                                    <li>
                                      {params.page === 1
                                        ? key + 1 > 9
                                          ? key + 1
                                          : "0" + (key + 1)
                                        : params.limit * (params.page - 1) +
                                          (key + 1 > 9
                                            ? key + 1
                                            : "0" + (key + 1))}
                                    </li>
                                  </ul>
                                </td>
                                <td>{item?.name}</td>
                                <td>{item?.location}</td>
                                <td>
                                  {item?.featured && (
                                    <span
                                      class="badge badge-primary border-0 px-2"
                                      style={{ fontSize: "9px" }}
                                    >
                                      Feactured
                                    </span>
                                  )}

                                  {item?.popular && (
                                    <span
                                      class="badge badge-success border-0 px-2 mx-1"
                                      style={{ fontSize: "9px" }}
                                    >
                                      Popular
                                    </span>
                                  )}
                                </td>

                                <td>
                                  <div className="dropdown">
                                    <button
                                      type="button"
                                      className="btn btn-light sharp"
                                      data-bs-toggle="dropdown"
                                    >
                                      <svg
                                        width="20px"
                                        height="20px"
                                        viewBox="0 0 24 24"
                                        version="1.1"
                                      >
                                        <g
                                          stroke="none"
                                          strokeWidth={1}
                                          fill="none"
                                          fillRule="evenodd"
                                        >
                                          <rect
                                            x={0}
                                            y={0}
                                            width={24}
                                            height={24}
                                          />
                                          <circle
                                            fill="#000000"
                                            cx={5}
                                            cy={12}
                                            r={2}
                                          />
                                          <circle
                                            fill="#000000"
                                            cx={12}
                                            cy={12}
                                            r={2}
                                          />
                                          <circle
                                            fill="#000000"
                                            cx={19}
                                            cy={12}
                                            r={2}
                                          />
                                        </g>
                                      </svg>
                                    </button>
                                    <div className="dropdown-menu">
                                      <a
                                        className="dropdown-item"
                                        href="#"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          EditData(item);
                                        }}
                                      >
                                        Edit
                                      </a>
                                      <a
                                        className="dropdown-item  text-danger"
                                        href="#"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          setRemove({
                                            ...remove,
                                            show: true,
                                            id: item._id,
                                          });
                                        }}
                                      >
                                        Delete
                                      </a>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </>
                        ) : (
                          <tr>
                            <td
                              colSpan={5}
                              className="text-center py-4 text-primary"
                            >
                              <b>No data</b>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end mx-4 mb-3">
              <button
                className="btn btn-sm btn-primary"
                disabled={pagination.hasPreviousPage == false}
                onClick={() => setparams({ ...params, page: params.page - 1 })}
              >
                <i className="fa-solid fa-angle-left" />
              </button>

              <button
                className="btn btn-sm btn-primary mx-1"
                disabled={pagination.hasNextPage == false}
                onClick={() => setparams({ ...params, page: params.page + 1 })}
              >
                <i className="fa-solid fa-angle-right" />
              </button>
            </div>
          </div>
        </div>

        {/* ADD PACKAGE POPUP */}

        <Modal show={show} onHide={handleClose}>
          <div className="card">
            <div className="card-header">
              {/* <h4 className="card-title ">Enter Details</h4> */}
            </div>
            <div className="card-body">
              <div className="basic-form">
                <Form
                  noValidate
                  validated={validated}
                  onSubmit={(e) => handleSubmit(e, setValidated, project)}
                >
                  <Form.Group>
                    <Form.Label className="mb-1 my-2">
                      Enter Project Name
                    </Form.Label>
                    <InputGroup hasValidation>
                      <Form.Control
                        required
                        type="text"
                        placeholder="name"
                        value={data.name}
                        onChange={(e) =>
                          setData({ ...data, name: e.target.value })
                        }
                        aria-describedby="inputGroupPrepend"
                      />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label className="mb-1 my-2">
                      Enter a Location
                    </Form.Label>
                    <Form.Control
                      required
                      type="text"
                      placeholder="location"
                      value={data.location} // Use the value from the data state
                      onChange={(e) => {
                        setData({ ...data, location: e.target.value }); // Set location using e.target.value
                      }}
                      aria-describedby="inputGroupPrepend"
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label className="mb-1">Description</Form.Label>
                    <Form.Control
                      rows={3}
                      placeholder="Enter description"
                      value={data.description}
                      onChange={(e) =>
                        setData({ ...data, description: e.target.value })
                      }
                      required // Add the required attribute
                    />
                  </Form.Group>
                  <Form.Group>
                    <InputGroup hasValidation>
                      <Form.Check
                        type="checkbox"
                        id="featuredCheckbox"
                        checked={data.featured}
                        onChange={(e) =>
                          setData({ ...data, featured: e.target.checked })
                        }
                        label="Featured"
                      />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group>
                    <InputGroup hasValidation>
                      <Form.Check
                        type="checkbox"
                        id="popularCheckbox"
                        checked={data.popular}
                        onChange={(e) =>
                          setData({ ...data, popular: e.target.checked })
                        }
                        label="Popular"
                      />
                    </InputGroup>
                  </Form.Group>

                  <div className="text-center mt-4 my-2">
                    <Button
                      type="submit"
                      className="btn btn-primary btn-block my-2"
                    >
                      Submit
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </Modal>

        <Modal show={remove.show} onHide={handleClose}>
          <Modal.Body>
            <p>Are you sure to delete </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleDelete}>
              Yes
            </Button>
            <Button variant="primary" onClick={handleCloses}>
              No
            </Button>
          </Modal.Footer>
        </Modal>

        {/* edit data in modal*/}
        <Modal show={edit} onHide={handleClos}>
          <div className="card">
            <div className="card-header"></div>
            <div className="card-body">
              <div className="basic-form">
                <Form
                  onSubmit={(e) => handleSubmit(e, setValidated, handleEdit)}
                >
                  <Form.Group as={Col} controlId="validationCustom01" />
                  <Form.Label className="mb-1">Edit Data</Form.Label>
                  <Form.Group>
                    <InputGroup hasValidation>
                      <Form.Control
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={editedItem.name}
                        onChange={handleFieldChange}
                        aria-describedby="inputGroupPrepend"
                      />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label className="mb-1 my-2">
                      Enter a Location
                    </Form.Label>
                    <Form.Control
                      required
                      type="text"
                      placeholder="location"
                      value={editedItem.location} // Use the value from the data state
                      onChange={handleFieldChange}
                      describedby="inputGroupPrepend"
                    />
                  </Form.Group>

                  <Form.Group>
                    <InputGroup hasValidation>
                      <Form.Check
                        type="checkbox"
                        id="featuredCheckbox"
                        name="featured" // Match the name to the property in editedItem
                        checked={editedItem.featured} // Use checked to reflect the state
                        onChange={handleFieldChange}
                        label="Featured"
                      />
                    </InputGroup>
                  </Form.Group>

                  <Form.Group>
                    <InputGroup hasValidation>
                      <Form.Check
                        type="checkbox"
                        id="featuredCheckbox"
                        name="popular" // Match the name to the property in editedItem
                        checked={editedItem.popular} // Use checked to reflect the state
                        onChange={handleFieldChange}
                        label="popular"
                      />
                    </InputGroup>
                  </Form.Group>

                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClos}>
                      Close
                    </Button>
                    <Button
                      variant="primary"
                      type="submit"
                      onClick={handleClos}
                    >
                      Save Changes
                    </Button>
                  </Modal.Footer>
                </Form>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
export default ProjectsPage;
