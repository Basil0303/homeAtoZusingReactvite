import React, { useEffect, useState } from "react";
import { apiCall } from "../Services/ApiCall";
import { userUrl } from "../Services/baseUrl";
import { useAsyncValue, useNavigate, useParams } from "react-router-dom";
import { Modal } from "react-bootstrap";
// import { useParams } from "react-router-dom";
import { PackageApplicationUrl } from "../Services/baseUrl";

function CustomerPage() {
  const [list, setlist] = useState();

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
  const [show, setShow] = useState(false);
  const [packageDetails, setPackageDetails] = useState([]);

  const getCustomers = async () => {
    const response = await apiCall("get", userUrl, {}, params);
    const { hasNextPage, hasPreviousPage, totalDocs, docs } = response?.data;

    setlist(docs ?? []);
    setpagination({ hasNextPage, hasPreviousPage, totalDocs });
  };

  const getPackages = async (id) => {
    try {
      const response = await apiCall("get", `${PackageApplicationUrl}/${id}`);
      if (response.status === true) {
        setPackageDetails(response?.data?.docs);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCustomers();
  }, [params]);

  return (
    <>
      <div className="col-xl-12">
        <div className="card dz-card" id="bootstrap-table11">
          <div className="card-header flex-wrap d-flex justify-content-between">
            <div>
              <h4 className="card-title">Customer Table</h4>
            </div>

            <ul
              className="nav nav-tabs dzm-tabs"
              id="myTab-8"
              role="tablist"
              style={{ backgroundColor: "white" }}
            >
              <li className="nav-item" role="presentation">
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
            </ul>
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
                        <th>Image</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Place</th>
                        <th>Packages</th>
                      </tr>
                    </thead>
                    <tbody>
                      {!list ? (
                        <tr>
                          <td colSpan={7} className="text-center py-4">
                            <div class="spinner-border" role="status">
                              <span class="sr-only">Loading...</span>
                            </div>
                          </td>
                        </tr>
                      ) : list?.length ? (
                        <>
                          {list.map((item, key) => (
                            <tr>
                              <td style={{ width: "2%" }}>
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

                              <td>{item?.fullName}</td>
                              <td>
                                {" "}
                                <img
                                  src={item?.image ?? "images/user.webp"}
                                  height={"50px"}
                                  width={"50px"}
                                  alt=""
                                />
                              </td>

                              <td>{item?.email}</td>
                              <td>{item?.mobile}</td>

                              <td>
                                {item?.district}
                                {item?.state},{item?.pincode}
                              </td>

                              <td>
                                <i
                                  className="fas fa-eye"
                                  style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                  onClick={() => {
                                    getPackages(item._id);
                                    setShow(true);
                                  }}
                                ></i>
                              </td>
                            </tr>
                          ))}
                        </>
                      ) : (
                        <tr>
                          <td
                            colSpan={7}
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

      <Modal show={show} onHide={() => setShow(false)}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="mt-2">View Details</h5>
            <button
              type="button"
              onClick={() => setShow(false)}
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
                      {packageDetails.map((details, key) => (
                        <>
                          <div className="row profileData">
                            <label
                              className="col-sm-4 col-form-label"
                              style={{ paddingTop: "10px" }}
                              htmlFor="basic-default-name"
                            >
                              <span>Name</span>
                            </label>
                            <div className="col-sm-7 mt-2">
                              <span>{details?.name}</span>
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
                                  src={details?.cover_image}
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
                              {details?.gallery_imgs.map((img, key) => (
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
                              <sapn>Hometype Name</sapn>
                            </label>
                            <div className="col-sm-7 mt-2 d-flex flex-column">
                              <span>{details?.home_type_id?.name}</span>
                              <img
                                className="mt-2"
                                src={details?.home_type_id?.image}
                                width={64}
                                height={64}
                                alt="Cover Image"
                              />
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
                              <span>{details?.price_per_sqft}</span>
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
                              <span>{details?.description}</span>
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
                            <div className="col-sm-7 mt-2">
                              <span>{details?.average_rating}</span>
                            </div>
                          </div>
                          <hr />
                          <table className="table table-bordered">
                            <thead>
                              <tr style={{ color: "black" }}>
                                <th>Material</th>
                                <th>Description</th>
                              </tr>
                            </thead>
                            <tbody>
                              {details?.materials.map((value, key) => (
                                <tr key={key}>
                                  <td>
                                    {" "}
                                    <span
                                      className="table-cell"
                                      style={{
                                        marginRight: "10px",
                                        color: "#888888",
                                      }}
                                    >
                                      {value.name}
                                    </span>
                                  </td>

                                  <td>
                                    {" "}
                                    <span
                                      className="table-cell"
                                      style={{
                                        marginRight: "10px",
                                        color: "#888888",
                                      }}
                                    >
                                      {value.description}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <hr />
                          <div className="row profileData">
                            <label
                              className="col-sm-4 col-form-label"
                              htmlFor="basic-default-name"
                            >
                              <span>Plan</span>
                            </label>
                            <div className="col-sm-7 mt-2">
                              <span>
                                <a target="_blank" href={details?.plan}>
                                  {details?.plan}
                                </a>
                              </span>
                            </div>
                          </div>
                          <hr />{" "}
                          <div className="row profileData">
                            <label
                              className="col-sm-4 col-form-label"
                              htmlFor="basic-default-name"
                            >
                              <span>Sqft</span>
                            </label>
                            <div className="col-sm-7 mt-2">
                              <span>
                                <a>{details?.square_feet}</a>
                              </span>
                            </div>
                          </div>
                        </>
                      ))}
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default CustomerPage;
