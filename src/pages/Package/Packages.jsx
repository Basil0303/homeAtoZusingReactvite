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
    home_type_id: "",
    price_per_sqft: "",
    cover_image: "",
    description: "",
    gallery_imgs: "",
    materials: ["", "", ""],
    createdAt: "",
    updatedAt: "",
  });
  console.log(data,"data")

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
    if (hometypes?.length && materials?.length) {
      return;
    }
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
    const response = await apiCall("get", PackageUrl, { params });
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
        console.log(res);
        setData({ ...data, cover_image: res.filesUploaded[0].url });
        setEditedItem({ ...editedItem, cover_image: res.filesUploaded[0].url });
      },
    };
    client.picker(options).open();
  };

  const [show, setShow] = useState(false);

  //add data
  const home = async () => {
    const dataToAdd={
      ...data,
      gallery_imgs: data.gallery_imgs,
      cover_image: data.cover_image,

    };
    console.log(dataToAdd,"data to addd")
        const response = await apiCall("post", PackageUrl, 
         dataToAdd
    );
  
    
    console.log(response);
    getHome();
    setData({})
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
      [name]: value === null ? "" : value,
      cover_image: data.cover_image,
    }));
  };

  const handleEdit = async () => {
    const completeEditedItem = {
      ...editedItem,
      cover_image: editedItem.cover_image,
      gallery_imgs: editedItem.gallery_imgs,
    };

    await apiCall("put", `${PackageUrl}/${editedItem.id}`, 
      completeEditedItem
    );
    handleClose();
    getHome();
  };

  // const EditData = (item) => {
  //   console.log(item);
  //   setEditedItem({
  //     id: item._id,
  //     name: item.name,
  //     cover_image: item.cover_image,
  //     gallery_imgs: item.gallery_imgs,
  //     home_type_id: item.home_type_id,
  //     price_per_sqft: item.price_per_sqft,
  //     description: item.description,
  //     materials: item.materials,
  //   });
  //   setEdit(true);
  // };


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
      materials: item.materials.map(
        (element) => {
          element._id, element.name;
        }
        // label: element.name,
      ),
    });
    setEdit(true);
  };

  //delete data from package
  const handleDelete = async () => {
    // console.log (remove.id)
    const response = await apiCall("delete", `${PackageUrl}/${remove.id}`, {
      data,
    });
    console.log("Item deleted:", response);
    setRemove({ show: false, id: null });
    getHome();
  };

  //get data
  const getHome = async () => {
    const response = await apiCall("get", PackageUrl, { params });
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
    console.log(item);
    setData({
      id: item._id,
      name: item.name,
      home_type_id: item.home_type_id.name,
      price_per_sqft: item.price_per_sqft,
      cover_image: item.cover_image,
      gallery_imgs: item.gallery_imgs,
      average_rating: item.average_rating,
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
        console.log(res);
        const uploadedImages = res.filesUploaded.map((file) => file.url);
        setData({ ...data, gallery_imgs: uploadedImages });
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
                        <th>#</th>
                        <th></th>
                        <th>Name</th>
                        <th>Home Type Id</th>
                        <th>Price Per Sqft</th>

                        <th>Description</th>
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

                              {/* Display gallery images
                              <td>
                                {data.gallery_imgs.length > 0 && (
                                  <div>
                                    {data.gallery_imgs.map(
                                      (imageUrl, index) => (
                                        <img
                                          key={index}
                                          src={imageUrl}
                                          width={80} // Adjust image dimensions as needed
                                          height={80}
                                          style={{
                                            objectFit: "cover",
                                          }}
                                          alt={`Image ${index}`}
                                        />
                                      )
                                    )}
                                  </div>
                                )}
                              </td> */}

                              <td>{item?.description}</td>
                              <td>{item?.materials?.name}</td>
                              {/* <td>{formatUpdateTime(item?.createdAt)}</td>
                              <td>{formatUpdateTime(item.updatedAt)}</td> */}
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
                onSubmit={(e) => handleSubmit(e, setValidated, home)} // Pass just the event to handleSubmit
              >
                {" "}
                <Form.Group>
                  <Form.Label className="mb-1 my-2">
                    Enter Package Name
                  </Form.Label>
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
                <Form.Group>
                  <Form.Label className="mb-1 my-2">Choose a Hometype</Form.Label>
                  <Select
                    options={hometypes}
                    onChange={(homeType) => {
                      setData({ ...data, home_type_id: homeType.value });
                      console.log(homeType.value);
                    }}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label className="mb-1 my-3">Price Per Sqft</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      required
                      type="number"
                      placeholder="Enter Price per sqft"
                      value={data.price_per_sqft} // Use inputValue for name input
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
                <Form.Group
                  className="mb-3 my-2"
                  as={Col}
                  controlId="validationCustom02"
                >
                  <img
                    src={
                      editedItem.cover_image
                        ? editedItem.cover_image
                        : "images/user.webp"
                    }
                    width={64}
                    height={64}
                    alt="Cover Image"
                  />
                </Form.Group>
                <Form.Group>
                  <Button
                    className="btn-sm bg-info text-white my-2 border-0"
                    onClick={openFilePicker}
                    type="file"
                    name="image"
                    accept="image/*"
                  >
                    Choose Cover Image
                  </Button>
                </Form.Group>
                <Form.Group>
                  <Form.Label className="mb-1 my-2">Description</Form.Label>
                  <InputGroup hasValidation>
                    <Form.Control
                      required
                      type="text"
                      placeholder="description"
                      value={data.description} // Use inputValue for name input
                      onChange={(e) =>
                        setData({ ...data, description: e.target.value })
                      }
                      aria-describedby="inputGroupPrepend"
                    />
                  </InputGroup>
                </Form.Group>
                <Form.Group>
                  <Button
                    required
                    className="btn-sm bg-info my-2 border-0 text-white "
                    multiple // Allow multiple file selection
                    onClick={openGalleryFilePicker}
                    onChange={(e) =>
                      setData({ ...data, gallery_imgs: e.target.value })
                    }
                  >
                    Choose Gallery Image
                  </Button>
                </Form.Group>
                {/* <Form.Group>
                  <InputGroup hasValidation>

                    <Form.Control
                      type="number"
                      placeholder="average_rating"
                      name="rating"
                      value={data.average_rating}
                      onChange={(e) => {
                        const enteredValue = parseFloat(e.target.value);
                        if (!isNaN(enteredValue) && enteredValue >= 0) {
                          setData({ ...data, average_rating: enteredValue });
                        }
                      }}
                      aria-describedby="inputGroupPrepend"
                      min="0" // Add this attribute to prevent negative values
                    />
                  </InputGroup>
                </Form.Group> */}
                <Form.Group>
                  <Select
                    className="my-2"
                    placeholder="materials"
                    isMulti
                    options={materials}
                    onChange={(selectedMaterials) => {
                      // selectedMaterials will be an array of selected values
                      const materialValues = selectedMaterials.map(
                        (material) => material.value
                      );
                      setData({ ...data, materials: materialValues });
                      console.log(materialValues);
                    }}
                  />
                </Form.Group>
                <Modal.Footer>
                  <Button  style={{backgroundColor:"grey"}}onClick={handleClose}>
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
          <p>Are you sure to delete </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDelete}>
            Yes
          </Button>
          <Button style={{backgroundColor:"grey"}} onClick={handleCloses}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
      {/* edit data in modal*/}
      <Modal show={edit} onHide={handleClos}>
        <div className="card">
          <div className="card-header">
            {/* <h4 className="card-title ">Enter Details</h4> */}
          </div>
          <div className="card-body">
            <div className="basic-form">
              <Form onSubmit={(e) => handleSubmit(e, setValidated, handleEdit)}>
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
                  <Form.Label className="mb-1">Type a Hometype</Form.Label>
                  <Select
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
                      placeholder="Price Per Sqft"
                      name="price_per_sqft" // Ensure that the name attribute matches the property name
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
                      placeholder="Description"
                      name="description" // Ensure that the name attribute matches the property name
                      value={editedItem.description}
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
                  <img
                    src={
                      editedItem.cover_image
                        ? editedItem.cover_image
                        : "images/user.webp"
                    }
                    width={64}
                    height={64}
                    alt="Cover Image"
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
                    type="file"
                    name="image"
                    accept="image/*"
                  >
                    Choose New Cover Image
                  </Button>
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
                  <img
                    src={
                      editedItem.gallery_imgs
                        ? editedItem.gallery_imgs
                        : "images/user.webp"
                    }
                    width={64}
                    height={64}
                    alt="gallery Image"
                  />
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  as={Col}
                  controlId="validationCustom02"
                >
                  <Button
                    className="btn-sm bg-info text-white my-1 border-0"
                    onClick={openGalleryFilePicker}
                    type="file"
                    name="gallery_imgs"
                    accept="image/*"
                  >
                    Choose New Gallery Images
                  </Button>
                </Form.Group>

                <Modal.Footer>
                  <Button style={{backgroundColor: "grey", color: "white"}}onClick={handleClos}>
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
      {/* view more data in modal*/}
      <Modal show={viewed} onHide={close}>
        <div className="card">
          <div className="modal-header">
            <button
              type="button"
              onClick={close}
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div className="card-body">
            <div className="basic-form">
              <Form onSubmit={(e) => handleSubmit(e, setValidated, handleEdit)}>
                <Form.Group as={Col} controlId="validationCustom01" />
                <Form.Label className="mb-1">View Details</Form.Label>
                <Form.Group>
                  <InputGroup hasValidation>
                    <Form.Control
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={data.name}
                      onChange={handleFieldChange}
                      aria-describedby="inputGroupPrepend"
                    />
                  </InputGroup>
                </Form.Group>
                <Form.Group>
                  <Form.Label className="mb-1">Choose a Hometype</Form.Label>
                  <Select
                    options={hometypes}
                    value={hometypes.find(
                      (option) => option.value === data.home_type_id
                    )}
                    onChange={(homeType) => {
                      setEditedItem({
                        ...data,
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
                      placeholder="Price Per Sqft"
                      name="price_per_sqft" // Ensure that the name attribute matches the property name
                      value={data.price_per_sqft}
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
                      placeholder="Description"
                      name="description" // Ensure that the name attribute matches the property name
                      value={data.description}
                      onChange={handleFieldChange}
                      aria-describedby="inputGroupPrepend"
                    />
                  </InputGroup>
                </Form.Group>
                <Form.Label className="mb-1"> Cover Image</Form.Label>
                <Form.Group
                  className="mb-3 my-2"
                  as={Col}
                  controlId="validationCustom02"
                >
                  <img
                    src={
                      editedItem.cover_image
                        ? editedItem.cover_image
                        : "images/user.webp"
                    }
                    width={64}
                    height={64}
                    alt="Cover Image"
                  />
                </Form.Group>
                <Form.Label className="mb-1">gallery image</Form.Label>
                <Form.Group
                  className="mb-3 my-1"
                  as={Col}
                  controlId="validationCustom02"
                >
                  <img
                    src={
                      editedItem.gallery_imgs
                        ? editedItem.gallery_imgs
                        : "images/user.webp"
                    }
                    width={64}
                    height={64}
                    alt="Cover Image"
                  />
                </Form.Group>
                {/* <Form.Label className="mb-1">Average Rating</Form.Label>
                <Form.Group>
                  <InputGroup hasValidation>
                    <Form.Control
                      className="my-1"
                      type="number"
                      placeholder="average_rating"
                      name="rating"
                      value={data.average_rating}
                      onChange={handleFieldChange}
                      aria-describedby="inputGroupPrepend"
                    />
                  </InputGroup>
                </Form.Group> */}
                <Form.Label className="mb-1">Choose Materials</Form.Label>
                <Form.Group>
                  <Select
                    className="my-1"
                    placeholder="materials"
                    isMulti
                    options={materials}
                    onChange={(selectedMaterials) => {
                      // selectedMaterials will be an array of selected values
                      const materialValues = selectedMaterials.map(
                        (material) => material.value
                      );
                      setData({ ...data, materials: materialValues });
                      console.log(materialValues);
                    }}
                  />
                </Form.Group>

                <Modal.Footer>
                  <Button  style={{  backgroundColor: "grey", color: "white" }}onClick={close}>
                    Close
                  </Button>
                  <Button variant="success" type="submit" onClick={close}>
                    Done
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

export default Packages;
