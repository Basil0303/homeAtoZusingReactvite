import React from "react";
import { apiCall } from "../../Services/ApiCall";
import { homeUrl } from "../../Services/baseUrl";
import { useState, useEffect } from "react";
import moment from "moment/moment";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import { handleSubmit } from "../../utils/Fns";
import { ShowToast } from "../../utils/Toast";

function Hometype() {
  const [validated, setValidated] = useState(false);

  const [data, setData] = useState({
    name: "",
    image: "",
    createdAt: "",
    updatedAt: "",
  });

  const [list, setlist] = useState();

  //file stack
  const client = filestack.init("AaRWObgSHSuGtGR3HqMYBz");
  const openFilePicker = () => {
    const options = {
      fromSources: ["local_file_system", "instagram", "facebook"],
      accept: ["image/*"],
      transformations: {
        crop: {
          aspectRatio: 1 / 1,
          force: true,
        },
      },
      maxFiles: 3,
      minFiles: 1,
      uploadInBackground: false,
      onUploadDone: (res) => {
        console.log(res);
        setData({ ...data, image: res.filesUploaded[0].url });
        setEditedItem({ ...editedItem, image: res.filesUploaded[0].url });
      },
    };
    client.picker(options).open();
  };

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  //add data
  const home = async () => {
    const response = await apiCall("post", homeUrl, data);
    console.log(response.data);
    getHome();
    ShowToast("Added Successfully", true);
    setData({
      name: "",
    });
    setValidated(false);
    setShow(false);
  };

  //edit data
  const [edit, setEdit] = useState(false);

  const handleClos = () => setEdit(false);

  const [editedItem, setEditedItem] = useState({ ...edit });

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setEditedItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  const handleEdit = async () => {
    const editedData = {
      ...editedItem,
      updatedAt: editedItem.updatedAt || new Date(),
    };
    await apiCall("put", `${homeUrl}/${editedItem.id}`, editedData);
    await apiCall("put", `${homeUrl}/${editedItem.id}`, editedData);
    handleClose();
    ShowToast("Updated Successfully", true);
    getHome();
  };

  //delete data from hometype
  const handleDelete = async () => {
    // console.log (remove.id)
    const response = await apiCall("delete", `${homeUrl}/${remove.id}`, {
      data,
    });
    console.log("Item deleted:", response);
    setRemove({ show: false, id: null });
    getHome();
  };

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

  useEffect(() => {
    getHome();
  }, [params]);

  const EditData = (item) => {
    console.log(item);
    setEditedItem({
      id: item._id,
      name: item.name,
      image: item.image, // Include the existing image URL
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    });
    setEdit(true);
  };

  const getHome = async () => {
    const response = await apiCall("get", homeUrl, {}, params);
    const { hasNextPage, hasPreviousPage, totalDocs, docs } = response?.data;

    setlist(docs ?? []);
    setpagination({ hasNextPage, hasPreviousPage, totalDocs });
  };

  function formatUpdateTime(updateTime) {
    // Use Moment.js to format the timestamp as desired
    return moment(updateTime).format("MMMM Do YYYY, h:mm:ss a");
  }

  const [remove, setRemove] = useState({
    show: false,
    id: null,
  });

  const handleCloses = () => setRemove(false);
  const handleShow = () => setRemove(true);

  return (
    <div>
      <div className="col-xl-12">
        <div className="card dz-card" id="bootstrap-table11">
          <div className="card-header flex-wrap d-flex justify-content-between">
            <div>
              <h4 className="card-title">Home Type</h4>
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
                        <th>SL No</th>
                        <th>Name</th>
                        <th>Image</th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {!list ? (
                        <tr>
                          <td colSpan={3} className="text-center py-4">
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
                              <td style={{ width: "2%" }}>
                                <img
                                  src={item?.image ?? "images/user.webp"}
                                  width={32}
                                  height={32}
                                  style={{
                                    objectFit: "cover",
                                    borderRadius: "4px",
                                    backgroundColor: "#eee",
                                  }}
                                />
                              </td>

                              <td className="text-center">
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
      {/*Add data in home */}
      <Modal show={show} onHide={handleClose}>
        <div className="card">
          <div className="card-header">
            <h4 className="card-title ">Add Home Type</h4>
          </div>
          <div className="card-body">
            <div className="basic-form">
              <Form
                noValidate
                validated={validated}
                onSubmit={(e) => handleSubmit(e, setValidated, home)} // Pass just the event to handleSubmit
              >
                <Form.Group as={Col} controlId="validationCustom01">
                  <Form.Label className="mb-1">Enter Name</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      required
                      type="text"
                      placeholder="name"
                      value={data.name} // Use inputValue for name input
                      onChange={(e) =>
                        setData({ ...data, name: e.target.value })
                      }
                      aria-describedby="inputGroupPrepend"
                    />
                  </InputGroup>
                </Form.Group>
                <Form.Group
                  
                  as={Col}
                  controlId="validationCustom02"
                >
                  <Button
                    className="btn-sm bg-info text-white my-2 border-0"
                    onClick={openFilePicker}
                  >
                    Upload Image
                  </Button>
                </Form.Group>
                <Modal.Footer>
                  <Button
                    style={{
                      backgroundColor: "grey",
                      color: "white",
                      
                    }}
                    size="sm" 
                    onClick={handleClose}
                  >
                    Close
                  </Button>
                  <Button variant="success" size="sm" type="submit" onClick={handleClos}>
                    Submit
                  </Button>
                </Modal.Footer>
              </Form>
            </div>
          </div>
        </div>
      </Modal>
      {/*Delete data in home */}
      <Modal show={remove.show} onHide={handleClose}>
        <Modal.Body>
          <p>Are you sure to delete </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
          variant="dark"
          size="sm" 
            onClick={handleCloses}
          >
            No
          </Button>
          <Button variant="danger" size="sm" onClick={handleDelete}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
      {/*Edit data in home */}
      <Modal show={edit} onHide={handleClos}>
        <div className="card">
          <div className="card-header">
            <h4 className="card-title ">Edit Details</h4>
          </div>
          <div className="card-body">
            <div className="basic-form">
              <Form
                noValidate
                validated={validated}
                onSubmit={(e) => handleSubmit(e, setValidated, handleEdit)}
              >
                <Form.Group as={Col} controlId="validationCustom01">
                  <Form.Label className="mb-1">Name</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="name"
                      value={editedItem.name}
                      onChange={handleFieldChange}
                      aria-describedby="inputGroupPrepend"
                    />
                  </InputGroup>
                </Form.Group>
                <Form.Group
                  className="mb-3 my-2"
                  as={Col}
                  controlId="validationCustom02"
                >
                  <Form.Label className="mb-1">Image</Form.Label>
                  <br />
                  <img
                    src={
                      editedItem.image ? editedItem.image : "images/user.webp"
                    }
                    width={64}
                    height={64}
                    alt="Cover Image"
                  />
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  as={Col}
                  controlId="validationCustom02"
                >
                  <Button
                    className="btn-sm bg-info text-white my-2 border-0"
                    onClick={openFilePicker}
                    type="button"
                    name="image"
                    accept="image/*"
                  >
                    Upload
                  </Button>
                </Form.Group>

                <Modal.Footer>
                  <Button
                    variant="dark"
                    size="sm" 
                    onClick={handleClos}
                  >
                    Close
                  </Button>
                  <Button variant="success"  size="sm" type="submit" onClick={handleClos}>
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

export default Hometype;
