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
import { ShowToast } from "../utils/Toast";

function ProjectsPage() {
  const [validated, setValidated] = useState(false);
  const [details, setDetails] = useState({ show: false, data: null })
  console.log(details, 'details modal')


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
    featured: false,
    popular: false,
    description: "",
    amnities: {
      bed: "",
      kitchen: "",
      sofa: "",
      shower: "",
      storage_space: "",
      total_Sqft: "",
    },
    gallery: "",
    plan: "",
  });

  const [list, setlist] = useState();

  useEffect(() => {
    initApis();
  }, [params]);

  const initApis = async () => {
    getPackages();
  };

  const getPackages = async () => {
    const response = await apiCall("get", ProjectUrl, {}, params);
    const { hasNextPage, hasPreviousPage, totalDocs, docs } = response?.data;
    setlist(docs ?? []);
    setpagination({ hasNextPage, hasPreviousPage, totalDocs });
  };
  const [show, setShow] = useState(false);

  //add data
  const project = async () => {
    const dataToAdd = {
      ...data,
      gallery: data.gallery,
      plan: data.plan,
    };

    const response = await apiCall("post", ProjectUrl, dataToAdd);

    getProject();
    ShowToast("Updated Successfully", true);
    setData({
      name: "",
      location: "",
      description: "",
      amnities: {
        bed: "",
        kitchen: "",
        sofa: "",
        shower: "",
        storage_space: "",
        total_Sqft: "",
      },
    });
    setValidated(false);
    setShow(false);
  };

  //edit data

  const [edit, setEdit] = useState(false);

  const handleClos = () => setEdit(false);

  const [editedItem, setEditedItem] = useState({
    id: "",
    name: "",
    location: "",
    description: "",
    amnities: {
      bed: "",
      kitchen: "",
      sofa: "",
      shower: "",
      storage_space: "",
      total_sqft: "",
    },
    featured: false,
    popular: false,
    gallery: "",
    plan: "",
  });
  const handleFieldChange = (event, fieldName) => {
    if (!event) return;

    const { name, value, type, checked } = event.target || {};

    if (!name) return;

    if (type === "checkbox") {
      setEditedItem((prevItem) => ({
        ...prevItem,
        [name]: checked,
      }));
    } else {
      if (fieldName === "amnities") {
        // Handle amenities fields separately
        setEditedItem((prevItem) => ({
          ...prevItem,
          amnities: {
            ...prevItem.amnities,
            [name]: value,
          },
        }));
      } else {
        // For other fields, update as before
        setEditedItem((prevItem) => ({
          ...prevItem,
          [name]: value,
        }));
      }
    }
  };

  const handleAmenityChange = (key, value) => {
    setData((prevData) => ({
      ...prevData,
      amnities: {
        ...prevData.amnities,
        [key]: value,
      },
    }));
  };

  const EditData = (item) => {
    setEditedItem({
      id: item._id,
      name: item.name,
      location: item.location,
      description: item.description,
      amnities: item.amnities,
      featured: item.featured,
      popular: item.popular,
      gallery: item.gallery,
      plan: item.plan,
    });
    setEdit(true);
  };

  const handleEdit = async () => {
    const completeEditedItem = {
      ...editedItem,
      gallery: editedItem.gallery,
      plan: editedItem.plan,
    };

    await apiCall(
      "put",
      `${ProjectUrl}/${editedItem.id}`,
      completeEditedItem
    );
    handleClose();
    ShowToast("Updated Successfully", true);
    getPackages();
  };

  //delete data from table
  const handleDelete = async () => {
    const response = await apiCall("delete", `${ProjectUrl}/${remove.id}`, {
      data,
    });
    setRemove({ show: false, id: null });
    getProject();
  };

  //get data
  const getProject = async () => {
    const response = await apiCall("get", ProjectUrl, { params });
    const { hasNextPage, hasPreviousPage, totalDocs, docs } = response?.data;
    setlist(docs ?? []);
    setpagination({ hasNextPage, hasPreviousPage, totalDocs });
  };

  const handleClose = () => setShow(false);

  const [remove, setRemove] = useState({
    show: false,
    id: null,
  });

  const handleCloses = () => setRemove({show:false,id:null});

  //gallery images using file stack
  const client = filestack.init("AaRWObgSHSuGtGR3HqMYBz");
  const openGalleryFilePicker = () => {
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
        const uploadedImages = res.filesUploaded.map((file) => file.url);
        setData({ ...data, gallery: uploadedImages });
        setEditedItem({ ...editedItem, gallery: uploadedImages });
      },
    };
    client.picker(options).open();
  };

  //file stack usnig plan

  // const clients = filestack.init("AaRWObgSHSuGtGR3HqMYBz");
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
        const uploadedImages = res.filesUploaded.map((file) => file.url);
        setData({ ...data, plan: uploadedImages });
        setEditedItem({ ...editedItem, plan: uploadedImages });
      },
    };
    client.picker(options).open();
  };

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
                  <table className="table  table-responsive-sm">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Location</th>
                        <th>Cover</th>
                        <th />
                        <th>Action</th>
                        <th />
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
                              <td> <img src={item?.gallery} height={'100px'} width={'100px'} alt="" /></td>
                              <td>
                                {item?.featured && (
                                  <span
                                    class="badge rounded-pill bg-secondary px-2"
                                 
                                  >
                                    featured
                                  </span>
                                )}

                                {item?.popular && (
                                  <span
                                    class="badge rounded-pill bg-success px-2 mx-1"
                    
                                  >
                                    popular
                                  </span>
                                )}
                              </td>

                              {/* <td style={{ width: "2%" }}>
                                <img
                                  src={item?.gallery ?? "images/user.webp"}
                                  width={32}
                                  height={32}
                                  style={{
                                    objectFit: "cover",
                                    borderRadius: "4px",
                                    backgroundColor: "#eee",
                                  }}
                                />
                              </td> */}

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
                                    <a
                                      className="dropdown-item"
                                      href="#"
                                      onClick={() => setDetails({ show: true, data: item })}
                                    >
                                      View more
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





      {/* ------------view more modal---------------------- */}

      <Modal
        show={details.show}
        size="lg"
        onHide={() => setDetails({ show: false, data: null })}
      >
        <div className="modal-content">
          <div className="modal-header">
            <button
              type="button"
              onClick={() => setDetails({ show: false, data: null })}
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div className="card-body">
            <div className="row">


              <div>
                <h5 className="modal-title mb-3" id="exampleModalLabel3">
                  Project Details
                </h5>
              </div>
              <div className="col-xl card-bg">
                <div className="card mb-4">
                  <div className="card-body p-2">
                    <form style={{ paddingLeft: "10px", paddingRight: "10px" }}>


                      <div className="row profileData">
                        <label
                          className="col-sm-4 col-form-label"
                          style={{ paddingTop: "10px" }}
                          htmlFor="basic-default-name"
                        >
                          <span>name</span>
                        </label>
                        <div className="col-sm-7 mt-2">
                          <span>{details?.data?.name}</span>
                        </div>
                      </div>

                      <hr />

                      <div className="row profileData">
                        <label
                          className="col-sm-4 col-form-label"
                          htmlFor="basic-default-name"
                        >
                          <span>description</span>
                        </label>
                        <div className="col-sm-7 mt-2">
                          <span>
                            {details?.data?.description}
                          </span>
                        </div>
                      </div>

                      <hr />

                      <div className="row profileData">
                        <label
                          className="col-sm-4 col-form-label"
                          htmlFor="basic-default-name"
                        >
                          <span>location</span>
                        </label>
                        <div className="col-sm-7 mt-2">
                          <span>
                            {details?.data?.location}
                          </span>
                        </div>
                      </div>


                      <hr />

                      <div className="row profileData">
                        <label
                          className="col-sm-4 col-form-label"
                          htmlFor="basic-default-name">
                          <span>Gallery</span>
                        </label>
                        <div className="col-sm-7 mt-2">
                          <img src={details?.data?.gallery} height={'100px'} width={'100px'} alt="" />
                        </div>
                      </div>


                      <hr />


                      <div className="row profileData">
                        <label
                          className="col-sm-4 col-form-label"
                          htmlFor="basic-default-name"
                        >
                          <span>Plan</span>
                        </label>
                        <div className="col-sm-7 mt-2">
                          <img src={details?.data?.plan} height={'100px'} width={'100px'} alt="" />                        </div>
                      </div>

                      <hr />

                      <div className="row profileData">
                        <label
                          className="col-sm-4 col-form-label"
                          htmlFor="basic-default-name">
                          <span>amnities</span>
                        </label>
                        <div className="col-sm-7 mt-2">
                          <table className="table table-bordered">
                            <thead>
                              <tr>
                                <th>bed</th>
                                <th>kitchen</th>
                                <th>sofa</th>
                                <th>shower</th>
                                <th>storage_space</th>
                                <th>total_Sqft</th>
                              </tr>

                            </thead>
                            <tbody>
                              <tr>
                                <td>{details?.data?.amnities?.bed}</td>
                                <td>{details?.data?.amnities?.kitchen}</td>
                                <td>{details?.data?.amnities?.sofa}</td>
                                <td>{details?.data?.amnities?.shower}</td>
                                <td>{details?.data?.amnities?.storage_space}</td>
                                <td>{details?.data?.amnities?.total_Sqft}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>






                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* ADD PACKAGE POPUP */}

      <Modal show={show} onHide={handleClose}>
        <div className="card">
          <div className="card-header"></div>
          <div className="card-body">
            <div className="basic-form">
              <Form
                noValidate
                validated={validated}
                onSubmit={(e) => handleSubmit(e, setValidated, project)} // Pass just the event to handleSubmit
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
                  <Form.Label className="mb-1">
                    Enter a Description
                  </Form.Label>
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
                  <Form.Label className=" my-2">Amenities</Form.Label>
                  <div className="row">
                    <div className="col-md-4">
                      <label className="">Bed</label>
                      <input
                        required
                        className="form-control"
                        type="text"
                        value={data?.amnities?.bed}
                        onChange={(e) =>
                          handleAmenityChange("bed", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-md-4">
                      <label>Kitchen</label>
                      <input
                        required
                        className="form-control"
                        type="text"
                        value={data?.amnities?.kitchen}
                        onChange={(e) =>
                          handleAmenityChange("kitchen", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-md-4">
                      <label>Sofa</label>
                      <input
                        required
                        className="form-control"
                        type="text"
                        value={data?.amnities?.sofa}
                        onChange={(e) =>
                          handleAmenityChange("sofa", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-md-4">
                      <label>Shower</label>
                      <input
                        required
                        className="form-control"
                        type="text"
                        value={data?.amnities?.shower}
                        onChange={(e) =>
                          handleAmenityChange("shower", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-md-4">
                      <label>Storage Space</label>
                      <input
                        required
                        className="form-control"
                        type="text"
                        value={data?.amnities?.storage_space}
                        onChange={(e) =>
                          handleAmenityChange("storage_space", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-md-4">
                      <label>Total Sqft</label>
                      <input
                        required
                        className="form-control"
                        type="text"
                        value={data?.amnities?.total_Sqft}
                        onChange={(e) =>
                          handleAmenityChange("total_Sqft", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </Form.Group>

                <Form.Group>
                  <Button
                    required
                    className="btn-sm bg-info my-2 border-0 text-white "
                    multiple // Allow multiple file selection
                    onClick={openGalleryFilePicker}
                    onChange={(e) =>
                      setData({ ...data, gallery: e.target.value })
                    }
                  >
                    Choose Gallery Image
                  </Button>
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

                <Form.Group>
                  <Button
                    required
                    className="btn-sm bg-info my-2 border-0 text-white "
                    multiple // Allow multiple file selection
                    onClick={openFilePicker}
                    onChange={(e) =>
                      setData({ ...data, plan: e.target.value })
                    }
                  >
                    Choose plan Image
                  </Button>
                </Form.Group>

                <Modal.Footer>
                  <Button variant="dark" onClick={handleClose} >
                    Close
                  </Button>
                  <Button variant="success" type="submit">
                    Submit
                  </Button>
                </Modal.Footer>
              </Form>
            </div>
          </div>
        </div>
      </Modal>
      {/* delete data */}
      <Modal show={remove.show} onHide={handleCloses}  >
      <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body >
          <p>Are you sure to delete </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDelete}>
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
                noValidate
                validated={validated}
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
                    />
                  </InputGroup>
                </Form.Group>

                <Form.Group>
                  <Form.Label className="mb-1 my-2">
                    Enter a Location
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    placeholder="location"
                    value={editedItem.location}
                    onChange={handleFieldChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label className="mb-1">
                    Enter a Description
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="description"
                    placeholder="description"
                    value={editedItem.description}
                    onChange={handleFieldChange}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label className="mb-1 my-2">Amenities</Form.Label>
                  <div className="row">
                    <div className="col-md-4">
                      <label>Bed</label>
                      <input
                        className="form-control"
                        type="number"
                        value={editedItem.amnities.bed}
                        onChange={(e) => handleFieldChange(e, "amnities")}
                        name="bed"
                      />
                    </div>
                    <div className="col-md-4">
                      <label>Kitchen</label>
                      <input
                        className="form-control"
                        type="number"
                        value={editedItem.amnities.kitchen}
                        onChange={(e) => handleFieldChange(e, "amnities")}
                        name="kitchen"
                      />
                    </div>
                    <div className="col-md-4">
                      <label>Sofa</label>
                      <input
                        className="form-control"
                        type="number"
                        value={editedItem.amnities.sofa}
                        onChange={(e) => handleFieldChange(e, "amnities")}
                        name="sofa"
                      />
                    </div>
                    <div className="col-md-4">
                      <label>Shower</label>
                      <input
                        className="form-control"
                        type="number"
                        value={editedItem.amnities.shower}
                        onChange={(e) => handleFieldChange(e, "amnities")}
                        name="shower"
                      />
                    </div>
                    <div className="col-md-4">
                      <label>Storage Space</label>
                      <input
                        className="form-control"
                        type="number"
                        value={editedItem.amnities.storage_space}
                        onChange={(e) => handleFieldChange(e, "amnities")}
                        name="storage_space"
                      />
                    </div>
                    <div className="col-md-4">
                      <label>Total Sqft</label>
                      <input
                        className="form-control"
                        type="number"
                        value={editedItem.amnities.total_Sqft}
                        onChange={(e) => handleFieldChange(e, "amnities")}
                        name="total_Sqft"
                      />
                    </div>
                  </div>
                </Form.Group>
                <Form.Group
                  className="mb-3 my-2"
                  as={Col}
                  controlId="galleryImage"
                >
                  <img
                    src={
                      editedItem.gallery
                        ? editedItem.gallery
                        : "images/user.webp"
                    }
                    width={64}
                    height={64}
                    alt="Gallery"
                  />
                </Form.Group>
                <Form.Group>
                  <Button
                    className="btn-sm bg-info my-2 border-0 text-white"
                    multiple
                    type="file"
                    name="image"
                    accept="image/*"
                    onClick={openGalleryFilePicker}
                  >
                    Choose Gallery Image
                  </Button>
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

                <Form.Group
                  className="mb-3 my-2"
                  as={Col}
                  controlId="planImage"
                >
                  <img
                    src={
                      editedItem.plan ? editedItem.plan : "images/user.webp"
                    }
                    width={64}
                    height={64}
                    alt="Plan"
                  />
                </Form.Group>
                <Form.Group>
                  <Button
                    className="btn-sm bg-info my-2 border-0 text-white"
                    multiple
                    type="file"
                    name="image"
                    accept="image/*"
                    onClick={openFilePicker}
                  >
                    Choose New Plan Image
                  </Button>
                </Form.Group>

                <Modal.Footer>
                  <Button variant="dark" onClick={handleClos}>
                    Close
                  </Button>
                  <Button
                    variant="success"
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

export default ProjectsPage;
