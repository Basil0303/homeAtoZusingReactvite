import React from "react";
import { apiCall } from "../../Services/ApiCall";
import { PackageUrl, homeUrl, materialsUrl } from "../../Services/baseUrl";
import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import { handleSubmit } from "../../utils/Fns";
import Select from "react-select";
import { ShowToast } from "../../utils/Toast";

function Packages() {
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
    home_type_id: {},
    home_type_image: "",
    price_per_sqft: "",
    cover_image: "",
    description: "",
    gallery_imgs: [],
    materials: [],
    createdAt: "",
    updatedAt: "",
  });

  ////drop down  materials and select hometypes
  const [hometypes, setHometypes] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [list, setlist] = useState();
  const [selectedOptions, setselectedOptions] = useState([]);

  useEffect(() => {
    initApis();
  }, [params]);

  const initApis = async () => {
    await getPopupdata();
    getPackages();
  };

  const getPopupdata = async () => {
    // if (hometypes?.length && materials?.length) {
    //   return;
    // }
    const homeTypeResponse = await apiCall("get", homeUrl);
    const homeTypeList = homeTypeResponse?.data?.docs ?? [];
    const modifiedhomeTypeList = homeTypeList.map(({ _id, name }) => ({
      value: _id,
      label: name,
    }));

    setHometypes(modifiedhomeTypeList);

    const materialsResponse = await apiCall("get", materialsUrl);
    const materialsList = materialsResponse?.data?.docs ?? [];
    const modifiedMaterialsList = materialsList.map(({ _id, name }) => ({
      value: _id,
      label: name,
    }));
    setMaterials(modifiedMaterialsList);
  };

  const getPackages = async () => {
    const response = await apiCall("get", PackageUrl, {}, params);
    const { hasNextPage, hasPreviousPage, totalDocs, docs } = response?.data;
    setlist(docs ?? []);
    setpagination({ hasNextPage, hasPreviousPage, totalDocs });
  };

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
        setData({ ...data, cover_image: res.filesUploaded[0].url });
        setEditedItem({
          ...editedItem,
          cover_image: res.filesUploaded[0].url,
        });
      },
    };
    client.picker(options).open();
  };

  const [show, setShow] = useState(false);

  //add data
  const home = async () => {
    if (data.cover_image && data.materials.length > 0) {
      const dataToAdd = {
        ...data,
        gallery_imgs: data.gallery_imgs,
        cover_image: data.cover_image,
      };
      const response = await apiCall("post", PackageUrl, dataToAdd);
      getHome();
      ShowToast("Added Successfully", true);1111
      setData({});
      setValidated(false);
      setShow(false);
    } else {
      if (!data.cover_image) {
        ShowToast("Please choose a Cover Image", false);
      }
      if (data.materials.length === 0) {
        ShowToast("Please select materials", false);
      }
    }
  };

  //edit data
  const [edit, setEdit] = useState(false);

  const handleClos = () => setEdit(false);

  const [editedItem, setEditedItem] = useState({});
  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setEditedItem((prevItem) => ({
      ...prevItem,
      [name]: value === null ? "" : value,
    }));
  };

  const handleEdit = async () => {
    const completeEditedItem = {
      ...editedItem,
      cover_image: editedItem.cover_image,
      gallery_imgs: editedItem.gallery_imgs,
    };
    var materialsID = []
    selectedOptions.forEach((element) => {
      materialsID.push(element.value)
    })
    completeEditedItem.materials = materialsID
    await apiCall("put", `${PackageUrl}/${editedItem.id}`, completeEditedItem);
    handleClos();
    ShowToast("Updated Successfully", true);
    getHome();
    setValidated(false);
  };

  const EditData = (item) => {
    var data = [];
    item.materials.forEach((element) => {
      data.push({
        label: element.name,
        value: element._id,
      });
    });
    setselectedOptions(data);
    setEditedItem({
      id: item._id,
      name: item.name,
      cover_image: item.cover_image,
      gallery_imgs: item.gallery_imgs,
      home_type_id: item.home_type_id._id,
      price_per_sqft: item.price_per_sqft,
      description: item.description,
    });
    setEdit(true);
  };

  //delete data from package
  const handleDelete = async () => {
    const response = await apiCall("delete", `${PackageUrl}/${remove.id}`, {
      data,
    });
    console.log("Item deleted:", response);
    setRemove({ show: false, id: null });
    getHome();
  };

  //get data
  const getHome = async () => {
    const response = await apiCall("get", PackageUrl, {}, params);
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
  const handleShow = () => setRemove(true);

  //view more
  const [viewed, setViewed] = useState();
  const close = () => setViewed(false);
  const Viewmore = (item) => {
    setData({
      id: item._id,
      name: item.name,
      home_type_id: item.home_type_id.name,
      price_per_sqft: item.price_per_sqft,
      cover_image: item.cover_image,
      gallery_imgs: item.gallery_imgs,
      description: item.description,
      materials: item.materials,
    });
    setViewed(true);
  };

  //gallery images using file stack
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
      maxFiles: 3, // Adjust the maximum number of files allowed
      minFiles: 1,
      uploadInBackground: false,
      onUploadDone: (res) => {
        console.log("............",res)
        const uploadedImages = res.filesUploaded.map((file) => file.url);
        setData({ ...data, gallery_imgs: uploadedImages });
        setEditedItem({
          ...editedItem,
          gallery_imgs: uploadedImages,
        });
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
              <h4 className="card-title">Package Table</h4>
            </div>

            <div
              className="nav nav-tabs dzm-tabs d-flex align-items-center"
              id="myTab-8"
              role="tablist"
              style={{ backgroundColor: "white" }}
            >
              <li className="nav-item me-1" role="presentation">
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
                    <a href="javascript:void(0)">
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
                        <th></th>
                        <th>Name</th>
                        <th>Home Type Name</th>
                        <th>Price Per Sqft</th>
                        <th>Description</th>
                        <th />
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
                                          key +
                                          1 >
                                        9
                                      ? params.limit * (params.page - 1) +
                                        key +
                                        1
                                      : "0" +
                                        (params.limit * (params.page - 1) +
                                          key +
                                          1)}
                                  </li>
                                </ul>
                              </td>

                              <td style={{ width: "2%" }}>
                                <img
                                  src={item?.cover_image ?? "images/user.webp"}
                                  width={32}
                                  height={32}
                                  style={{
                                    objectFit: "cover",
                                    borderRadius: "4px",
                                    backgroundColor: "#eee",
                                  }}
                                />
                              </td>

                              <td>{item?.name}</td>
                              <td>{item?.home_type_id?.name}</td>
                              <td>{item?.price_per_sqft}</td>
                              <td>{item?.description}</td>
                              <td>{item?.materials?.name}</td>
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
                                      onClick={(e) => {
                                        e.preventDefault();
                                        Viewmore(item);
                                      }}
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
                            colSpan={6}
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
          <div className="card-header">Add Package</div>
          <div className="card-body">
            <div className="basic-form">
              <Form
                noValidate
                validated={validated}
                onSubmit={(e) => handleSubmit(e, setValidated, home)}
              >
                {" "}
                <Form.Group>
                  <Form.Label className="mb-1 my-2">Package Name</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      required
                      type="text"
                      placeholder="enter package name"
                      value={data.name} // Use inputValue for name input
                      onChange={(e) =>
                        setData({ ...data, name: e.target.value })
                      }
                      aria-describedby="inputGroupPrepend"
                    />
                  </InputGroup>
                </Form.Group>
                <Form.Group>
                  <Form.Label className="mb-1 my-2">Hometype</Form.Label>
                  <Select
                    placeholder="choose hometype "
                    required
                    options={hometypes}
                    onChange={(homeType) => {
                      setData({ ...data, home_type_id: homeType.value });
                    }}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label className="mb-1 my-2">Price Per Sqft</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      required
                      type="number"
                      placeholder="enter price per sqft"
                      value={data.price_per_sqft}
                      onChange={(e) => {
                        const enteredValue = parseFloat(e.target.value);
                        if (!isNaN(enteredValue) && enteredValue >= 0) {
                          setData({ ...data, price_per_sqft: enteredValue });
                        }
                      }}
                      aria-describedby="inputGroupPrepend"
                    />
                  </InputGroup>
                </Form.Group>
                <Form.Group>
                  <Form.Label className="mb-1 my-2">Description</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      required
                      type="text"
                      placeholder="enter description"
                      value={data.description}
                      onChange={(e) =>
                        setData({ ...data, description: e.target.value })
                      }
                      aria-describedby="inputGroupPrepend"
                    />
                  </InputGroup>
                </Form.Group>
                <Form.Group>
                  <Form.Label className="mb-1 my-2">
                    Choose Materials
                  </Form.Label>
                  <Select
                    className="my-2"
                    placeholder="choose material"
                    isMulti
                    options={materials}
                    onChange={(selectedMaterials) => {
                      const materialValues = selectedMaterials.map(
                        (material) => material.value
                      );
                      setData({ ...data, materials: materialValues });
                    }}
                  />
                </Form.Group>
                <Form.Group>
                  <Button
                    className="btn-sm bg-info text-white my-2 border-0"
                    onClick={openFilePicker}
                    name="image"
                    accept="image/*"
                  >
                    Choose Cover Image
                  </Button>
                </Form.Group>
                <Form.Group
                  className="mb-3 my-1"
                  as={Col}
                  controlId="validationCustom02"
                >
                  {data.cover_image && (
                    <img
                      src={data.cover_image}
                      width={64}
                      height={64}
                      alt="Cover Image"
                    />
                  )}
                </Form.Group>
                <Form.Group>
                  <Button
                    required
                    className="btn-sm bg-info my-2 border-0 text-white "
                    multiple
                    onClick={openGalleryFilePicker}
                    onChange={(e) =>
                      setData({ ...data, gallery_imgs: e.target.value })
                    }
                  >
                    Choose Gallery Image
                  </Button>
                </Form.Group>
                <Form.Group
                  className="mb-3 my-1"
                  as={Col}
                  controlId="validationCustom02"
                >
                  {data?.gallery_imgs?.map((imageUrl, index) => (
                    <img
                      key={index}
                      src={imageUrl}
                      alt={`Gallery Image ${index}`}
                      width={64}
                      height={64}
                      style={{ marginRight: "10px" }}
                    />
                  ))}
                </Form.Group>
                <Modal.Footer>
                  <Button variant="dark" onClick={handleClose}>
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
      </Modal>{" "}
      {/* delete  data in modal*/}
      <Modal show={remove.show} onHide={handleClose}>
        <Modal.Body>
          <p>Are you sure you want to delete? </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={handleCloses}>
            No
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
      {/* edit data in modal*/}
      <Modal show={edit} onHide={handleClos}>
        <div className="card">
          <div className="card-header">Edit Data</div>
          <div className="card-body">
            <div className="basic-form">
              <Form onSubmit={(e) => handleSubmit(e, setValidated, handleEdit)}>
                <Form.Group as={Col} controlId="validationCustom01" />
                <Form.Label className="mb-1">Package Name</Form.Label>
                <Form.Group>
                  <InputGroup hasValidation>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="enter package name"
                      value={editedItem.name}
                      onChange={handleFieldChange}
                      aria-describedby="inputGroupPrepend"
                    />
                  </InputGroup>
                </Form.Group>
                <Form.Group>
                  <Form.Label className="mb-1">Hometype</Form.Label>
                  <Select
                    placeholder="choose hometype"
                    options={hometypes}
                    value={hometypes.find(
                      (option) => option.value === editedItem.home_type_id
                    )}
                    onChange={(homeType) => {
                      setEditedItem({
                        ...editedItem,
                        home_type_id: homeType.value,
                      });
                    }}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label className="mb-1">Enter Price Sqft</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      type="number"
                      placeholder="enter price per sqft"
                      name="price_per_sqft"
                      value={editedItem.price_per_sqft}
                      onChange={handleFieldChange}
                      aria-describedby="inputGroupPrepend"
                    />
                  </InputGroup>
                </Form.Group>
                <Form.Group
                  className="mb-3 my-1"
                  as={Col}
                  controlId="validationCustom02"
                >
                  <Form.Label className="mb-1">Description</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      type="text"
                      placeholder="enter description"
                      name="description"
                      value={editedItem.description}
                      onChange={handleFieldChange}
                      aria-describedby="inputGroupPrepend"
                    />
                  </InputGroup>
                </Form.Group>
                <Form.Group>
                  <Select
                    className="my-2"
                    placeholder="materials"
                    isMulti
                    options={materials}
                    value={selectedOptions}
                    onChange={(selectedMaterials) =>
                      setselectedOptions(selectedMaterials)
                    }
                  />
                </Form.Group>

                <Form.Group
                  className="mb-3 my-1"
                  as={Col}
                  controlId="validationCustom02"
                >
                  <Button
                    className="btn-sm bg-info text-white my-1 border-0"
                    onClick={openFilePicker}
                    name="image"
                    accept="image/*"
                  >
                    Choose New Cover Image
                  </Button>
                </Form.Group>
                <Form.Group
                  className="mb-3 my-1"
                  as={Col}
                  controlId="validationCustom02"
                >
                  {editedItem.cover_image && (
                    <img
                      src={editedItem.cover_image}
                      width={64}
                      height={64}
                      alt="Cover Image"
                    />
                  )}
                </Form.Group>

                <Form.Group
                  className="mb-3"
                  as={Col}
                  controlId="validationCustom02"
                >
                  <Button
                    className="btn-sm bg-info text-white my-1 border-0"
                    onClick={openGalleryFilePicker}
                    name="gallery_imgs"
                    accept="image/*"
                  >
                    Choose New Gallery Images
                  </Button>
                </Form.Group>
                <Form.Group
                  className="mb-3 my-1"
                  as={Col}
                  controlId="validationCustom02"
                >
                  {editedItem.gallery_imgs?.map((imageUrl, index) => (
                    <img
                      key={index}
                      src={imageUrl}
                      alt={`Gallery Image ${index}`}
                      width={64}
                      height={64}
                      style={{ marginRight: "10px" }}
                    />
                  ))}
                </Form.Group>

                <Modal.Footer>
                  <Button variant="dark" onClick={handleClos}>
                    Close
                  </Button>
                  <Button variant="success" type="submit">
                    Save Changes
                  </Button>
                </Modal.Footer>
              </Form>
            </div>
          </div>
        </div>
      </Modal>
      {/* View Data Modal */}
      <Modal show={viewed} onHide={close}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="mt-2">View Details</h5>
            <button
              type="button"
              onClick={close}
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div className="card-body">
            <div className="row">
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
                          <span>Name</span>
                        </label>
                        <div className="col-sm-7 mt-2">
                          <span>{data?.name}</span>
                        </div>
                      </div>
                      <hr />
                      <div className="row profileData">
                        <label
                          className="col-sm-4 col-form-label"
                          htmlFor="basic-default-name"
                        >
                          <span>Cover Image</span>
                        </label>
                        <div className="col-sm-7 mt-2">
                          <span>
                            <img
                              src={data?.cover_image}
                              width={64}
                              height={64}
                              alt="Cover Image"
                            />
                          </span>
                        </div>
                      </div>

                      <hr />

                      <div className="row profileData">
                        <label
                          className="col-sm-4 col-form-label"
                          htmlFor="basic-default-name"
                        >
                          <span>Gallery Images</span>
                        </label>
                        <div className="col-sm-7 mt-2">
                          {data?.gallery_imgs?.map((img, key) => (
                            <span key={key} style={{ marginRight: "10px" }}>
                              <img
                                src={img}
                                width={64}
                                height={64}
                                alt={`Cover Image ${key + 1}`}
                              />
                            </span>
                          ))}
                        </div>
                      </div>
                      <hr />
                      <div className="row profileData">
                        <label
                          className="col-sm-4 col-form-label"
                          htmlFor="basic-default-name"
                        >
                          <span>Hometype Name</span>
                        </label>
                        <div className="col-sm-7 mt-2 d-flex flex-column">
                          <span>{data?.home_type_id}</span>
                        </div>
                      </div>

                      <hr />
                      <div className="row profileData">
                        <label
                          className="col-sm-4 col-form-label"
                          htmlFor="basic-default-name"
                        >
                          <span>Price Per Sqft</span>
                        </label>
                        <div className="col-sm-7 mt-2">
                          <span>{data?.price_per_sqft}</span>
                        </div>
                      </div>
                      <hr />
                      <div className="row profileData">
                        <label
                          className="col-sm-4 col-form-label"
                          htmlFor="basic-default-name"
                        >
                          <span>Materials</span>
                        </label>
                        <div className="col-sm-7 mt-2">
                          {data?.materials?.map((value, key) => (
                            <span key={key}>
                              {value.name}
                              {key < data.materials.length - 1 ? ", " : ""}
                            </span>
                          ))}
                        </div>
                      </div>
                      <hr />
                      <div className="row profileData">
                        <label
                          className="col-sm-4 col-form-label"
                          htmlFor="basic-default-name"
                        >
                          <span>Description</span>
                        </label>
                        <div className="col-sm-7 mt-2">
                          <span>{data?.description}</span>
                        </div>
                      </div>
                      <hr />
                      <div className="row profileData">
                        <label
                          className="col-sm-4 col-form-label"
                          htmlFor="basic-default-name"
                        >
                          <span>Average Rating</span>
                        </label>
                        <div className="col-sm-7 mt-2 mb-5">
                          <span>{data?.average_rating}</span>
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
    </div>
  );
}

export default Packages;
