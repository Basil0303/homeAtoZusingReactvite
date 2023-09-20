import React, { useState, useEffect } from "react";
import { apiCall } from "../Services/ApiCall";
import { loanUrl } from "../Services/baseUrl";
import moment from "moment/moment";
import Modal from "react-bootstrap/Modal";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { ShowToast } from "../utils/Toast";

function LoanApplicationPage() {
  const [loanList, setloanList] = useState();
  const [allLoans, setallLoans] = useState([]);
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
  const [show, setshow] = useState(false);
  const [loanData, setloanData] = useState({
    status: "",
    rejection_reason: "",
  });
  const [showRejectionForm, setShowRejectionForm] = useState(false);

  useEffect(() => {
    listLoanApplications();
  }, [params]);

  // List Loan Applications
  const listLoanApplications = async () => {
    var response = await apiCall("get", loanUrl, { params });
    const { hasNextPage, hasPreviousPage, totalDocs, docs } = response?.data;
    setloanList(docs ?? []);
    setallLoans(docs ?? []);
    setpagination({ hasNextPage, hasPreviousPage, totalDocs });
  };

  // Filtering data based on status
  const handleFilter = async (event) => {
    const selectedOption = event.target.value;
    var temp = [];
    if (selectedOption === "all") {
      setloanList(allLoans);
    } else {
      allLoans.forEach((element) => {
        if (element.status === selectedOption) {
          temp.push(element);
        }
      });
      setloanList(temp);
    }
  };

  // Loan Application Details View Modal
  const loanApplicationModal = async (loan) => {
    setloanData({
      ...loanData,
      fullName: loan?.user_id?.fullName,
      mobile: loan?.user_id?.mobile,
      email: loan?.user_id?.email,
      image: loan?.user_id?.image,
      district: loan?.user_id?.district,
      pincode: loan?.user_id?.pincode,
      state: loan?.user_id?.state,
      user_status: loan?.user_id?.status,
      address: loan?.address,
      date_of_birth: loan?.date_of_birth,
      contactNumber: loan?.mobile,
      whatsapp: loan?.whatsapp,
      nationality: loan?.nationality,
      employer_name: loan?.employer_name,
      employer_address: loan?.employer_address,
      occupation: loan?.occupation,
      pan_number: loan?.pan_number,
      affordable_downpayment: loan?.affordable_downpayment,
      loan_tenure: loan?.loan_tenure,
      source_of_fund: loan?.source_of_fund,
      down_payment: loan?.down_payment,
      bank_statement: loan?.bank_statement,
      tin_number: loan?.tin_number,
      status: loan?.status,
      rejection_reason:
        loan?.status == "rejected" ? loan?.rejection_reason : undefined,
      user_id: loan?.user_id?._id,
      loan_id: loan?._id,
    });
    setshow(true);
  };

  // Update Status
  const updateStatus = async () => {
    let updatedLoanData = { ...loanData };
    if (updatedLoanData?.status === "submitted") {
      updatedLoanData.status = "review";
    } else if (updatedLoanData?.status === "review") {
      updatedLoanData.status = "processing";
    } else {
      if (
        updatedLoanData?.status === "processing" &&
        updatedLoanData?.rejection_reason === ""
      ) {
        updatedLoanData.status = "eligible";
      } else {
        updatedLoanData.status = "rejected";
      }
    }
    var response = await apiCall(
      "put",
      `${loanUrl}/${updatedLoanData?.loan_id ?? ""}`,
      { data: updatedLoanData }
    );
    if (response.status) {
      ShowToast("Updated Successfully", true);
      listLoanApplications();
      setshow(false);
      setShowRejectionForm(false);
    }
  };

  // Rejected Reason Showing Modal
  const rejectionModal = () => {
    setShowRejectionForm(true);
  };

  // To Handle Rejected Reason
  const handleReason = (html) => {
    setloanData({ ...loanData, rejection_reason: html });
  };

  return (
    <>
      <div className="col-xl-12">
        <div className="card dz-card" id="bootstrap-table11">
          <div className="card-header flex-wrap d-flex justify-content-between">
            <div>
              <h4 className="card-title">Loan Application</h4>
            </div>

            <ul
              className="nav nav-tabs dzm-tabs"
              id="myTab-8"
              role="tablist"
              style={{ backgroundColor: "white" }}
            >
              <li className="nav-item">
                <div className="input-group">
                  <select
                    className="form-select"
                    id="exampleFormControlSelect1"
                    aria-label="Default select example"
                    style={{ width: "200px" }}
                    onChange={(e) => handleFilter(e)}
                  >
                    <option disabled selected value="">
                      -- Choose status --
                    </option>
                    <option value="all">All</option>
                    <option value="eligible">Eligible</option>
                    <option value="processing">Processing</option>
                    <option value="rejected">Rejected</option>
                    <option value="review">Review</option>
                    <option value="submitted">Submitted</option>
                  </select>
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
                        <th>Phone</th>
                        <th>Applied Date</th>
                        <th>Status</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {!loanList ? (
                        <tr>
                          <td colSpan={5} className="text-center py-4">
                            <div className="spinner-border" role="status">
                              <span className="sr-only">Loading...</span>
                            </div>
                          </td>
                        </tr>
                      ) : loanList?.length ? (
                        <>
                          {loanList.map((item, key) => (
                            <>
                              <tr key={item._id}>
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
                                <td>{item?.user_id.fullName ?? ""}</td>
                                <td>{item?.user_id?.mobile ?? ""}</td>
                                <td>
                                  {moment(item?.createdAt ?? "").format(
                                    "DD-MM-YYYY"
                                  )}
                                </td>
                                <td>
                               
                                  {item?.status === "submitted" && (
                                    <span
                                      className="badge rounded-pill bg-primary px-2"
                                      style={{ fontSize: "9px" }}
                                    >
                                      Submitted
                                    </span>
                                  )}

                                  {item?.status === "review" && (
                                    <span
                                      className="badge rounded-pill bg-info px-2"
                                      style={{ fontSize: "9px" }}
                                    >
                                      Review
                                    </span>
                                  )}

                                  {item?.status === "processing" && (
                                       <span className="badge rounded-pill bg-warning px-2" style={{ fontSize: '9px', }}>
                                       Processing
                                     </span>
                                  )}

                                  {item?.status === "rejected" && (
                                  <span className="badge rounded-pill bg-danger px-2" style={{ fontSize: '9px', }}>
                                  Rejected
                                </span>
                                
                                  )}

                                  {item?.status === "eligible" && (
                                   <span className="badge rounded-pill bg-success px-2" style={{ fontSize: '9px', }}>
                                   Eligible
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
                                        onClick={() =>
                                          loanApplicationModal(item)
                                        }
                                      >
                                        View more
                                      </a>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            </>
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

          {/* Pagination */}
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

      <Modal
        show={show}
        size="lg"
        onHide={() => setshow(false) & setShowRejectionForm(false)}
      >
        <div className="modal-content">
          <div className="modal-header">
            <button
              type="button"
              onClick={() => setshow(false)}
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div className="card-body">
            <div>
              <h5 className="modal-title mb-3" id="exampleModalLabel3">
                Applicant Details
              </h5>
            </div>
            <div className="row"></div>
            <div className="row">
              <div className="col-md-6">
                <div
                  className="row"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "200px",
                  }}
                >
                  <div className="col-5">
                    <img
                      alt="user-avatar"
                      src={loanData?.image}
                      style={{
                        height: "170px",
                        width: "130px",
                        paddingBottom: "30px",
                        borderRadius: "10%",
                        paddingLeft: "5px",
                        paddingTop: "5px",
                      }}
                    />
                  </div>
                  <div className="col-7">
                    <span>{loanData?.fullName}</span>
                    <br />
                    <br />
                    <span>{loanData?.mobile}</span>
                    <br />
                    <br />
                    <span>{loanData?.email}</span>
                    <br />
                    <br />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className=" card-bg">
                  <div className="card mb-4">
                    <div className="card-body p-2">
                      <form
                        style={{ paddingLeft: "10px", paddingRight: "10px" }}
                      >
                        <div className="row profileData">
                          <label
                            className="col-sm-4 col-form-label"
                            style={{ paddingTop: "10px" }}
                            htmlFor="basic-default-name"
                          >
                            <span>District</span>
                          </label>
                          <div className="col-sm-7 mt-2">
                            <span>{loanData?.district}</span>
                          </div>
                        </div>
                        <hr />
                        <div className="row profileData">
                          <label
                            className="col-sm-4 col-form-label"
                            htmlFor="basic-default-name"
                          >
                            <span>Pincode</span>
                          </label>
                          <div className="col-sm-7 mt-2">
                            <span>{loanData?.pincode}</span>
                          </div>
                        </div>
                        <hr />
                        <div className="row profileData">
                          <label
                            className="col-sm-4 col-form-label"
                            htmlFor="basic-default-name"
                          >
                            <span>State</span>
                          </label>
                          <div className="col-sm-7 mt-2">
                            <span>{loanData?.state}</span>
                          </div>
                        </div>
                        <hr />
                        <div className="row profileData">
                          <label
                            className="col-sm-4 col-form-label"
                            htmlFor="basic-default-name"
                          >
                            <span>Status</span>
                          </label>
                          <div
                            className="col-sm-7 mt-2"
                            style={{ paddingBottom: "10px" }}
                          >
                            {loanData?.user_status === "new" && (
                              <span
                              className="badge rounded-pill bg-primary px-2"
                              style={{ fontSize: "9px" }}
                              >
                                New
                              </span>
                            )}

                            {loanData?.user_status === "submitted" && (
                              <span
                              className="badge rounded-pill bg-primary px-2"
                              style={{ fontSize: "9px" }}
                              >
                                Submitted
                              </span>
                            )}

                            {loanData?.user_status === "review" && (
                              <span
                              className="badge rounded-pill bg-info px-2"
                              style={{ fontSize: "9px" }}
                              >
                                Review
                              </span>
                            )}

                            {loanData?.user_status === "processing" && (
                               <span className="badge rounded-pill bg-warning px-2" style={{ fontSize: '9px', }}>
                               Processing
                             </span>
                            )}

                            {loanData?.user_status === "rejected" && (
                              <span className="badge rounded-pill bg-danger px-2" style={{ fontSize: '9px', }}>
                              Rejected
                            </span>
                            
                            )}

                            {loanData?.user_status === "eligible" && (
                               <span className="badge rounded-pill bg-success px-2" style={{ fontSize: '9px', }}>
                               Eligible
                             </span>
                            )}

                            {loanData?.user_status === "updating" && (
                              <span
                                className="badge badge-dark border-0 px-2"
                                style={{ fontSize: "12px" }}
                              >
                                Updating
                              </span>
                            )}
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="modal-title mb-3" id="exampleModalLabel3">
                  Application Details
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
                          <span>Address</span>
                        </label>
                        <div className="col-sm-7 mt-2">
                          <span>{loanData?.address}</span>
                        </div>
                      </div>
                      <hr />
                      <div className="row profileData">
                        <label
                          className="col-sm-4 col-form-label"
                          htmlFor="basic-default-name"
                        >
                          <span>DOB</span>
                        </label>
                        <div className="col-sm-7 mt-2">
                          <span>
                            {moment(loanData?.date_of_birth).format(
                              "DD-MM-YYYY"
                            )}
                          </span>
                        </div>
                      </div>
                      <hr />
                      <div className="row profileData">
                        <label
                          className="col-sm-4 col-form-label"
                          htmlFor="basic-default-name"
                        >
                          <span>Contact Number</span>
                        </label>
                        <div className="col-sm-7 mt-2">
                          <span>{loanData?.contactNumber}</span>
                        </div>
                      </div>
                      <hr />
                      <div className="row profileData">
                        <label
                          className="col-sm-4 col-form-label"
                          htmlFor="basic-default-name"
                        >
                          <span>Whatsapp Number</span>
                        </label>
                        <div className="col-sm-7 mt-2">
                          <span>{loanData?.whatsapp}</span>
                        </div>
                      </div>
                      <hr />
                      <div className="row profileData">
                        <label
                          className="col-sm-4 col-form-label"
                          htmlFor="basic-default-name"
                        >
                          <span>Nationality</span>
                        </label>
                        <div className="col-sm-7 mt-2">
                          <span>{loanData?.nationality}</span>
                        </div>
                      </div>
                      <hr />
                      <div className="row profileData">
                        <label
                          className="col-sm-4 col-form-label"
                          htmlFor="basic-default-name"
                        >
                          <span>Employer Name</span>
                        </label>
                        <div className="col-sm-7 mt-2">
                          <span>{loanData?.employer_name}</span>
                        </div>
                      </div>
                      <hr />
                      <div className="row profileData">
                        <label
                          className="col-sm-4 col-form-label"
                          htmlFor="basic-default-name"
                        >
                          <span>Employer Address</span>
                        </label>
                        <div className="col-sm-7 mt-2">
                          <span>{loanData?.employer_address}</span>
                        </div>
                      </div>
                      <hr />
                      <div className="row profileData">
                        <label
                          className="col-sm-4 col-form-label"
                          htmlFor="basic-default-name"
                        >
                          <span>Occupation</span>
                        </label>
                        <div className="col-sm-7 mt-2">
                          <span>{loanData?.occupation}</span>
                        </div>
                      </div>
                      <hr />
                      <div className="row profileData">
                        <label
                          className="col-sm-4 col-form-label"
                          htmlFor="basic-default-name"
                        >
                          <span>Pancard No.</span>
                        </label>
                        <div className="col-sm-7 mt-2">
                          <span>{loanData?.pan_number}</span>
                        </div>
                      </div>
                      <hr />
                      <div className="row profileData">
                        <label
                          className="col-sm-4 col-form-label"
                          htmlFor="basic-default-name"
                        >
                          <span>Affordable Down Payment</span>
                        </label>
                        <div className="col-sm-7 mt-2">
                          <span>{loanData?.affordable_downpayment}</span>
                        </div>
                      </div>
                      <hr />
                      <div className="row profileData">
                        <label
                          className="col-sm-4 col-form-label"
                          htmlFor="basic-default-name"
                        >
                          <span>Loan Tenure</span>
                        </label>
                        <div className="col-sm-7 mt-2">
                          <span>{loanData?.loan_tenure}</span>
                        </div>
                      </div>
                      <hr />
                      <div className="row profileData">
                        <label
                          className="col-sm-4 col-form-label"
                          htmlFor="basic-default-name"
                        >
                          <span>Source of Fund</span>
                        </label>
                        <div className="col-sm-7 mt-2">
                          <span>{loanData?.source_of_fund}</span>
                        </div>
                      </div>
                      <hr />
                      <div className="row profileData">
                        <label
                          className="col-sm-4 col-form-label"
                          htmlFor="basic-default-name"
                        >
                          <span>Down Payment(%)</span>
                        </label>
                        <div className="col-sm-7 mt-2">
                          <span>
                            {" "}
                            {loanData?.down_payment &&
                              Object.values(loanData.down_payment).join(" , ")}
                          </span>
                        </div>
                      </div>
                      <hr />
                      <div className="row profileData">
                        <label
                          className="col-sm-4 col-form-label"
                          htmlFor="basic-default-name"
                        >
                          <span>Bank Statement</span>
                        </label>
                        <div className="col-sm-7 mt-2">
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-color"
                            style={{
                              width: "140px",
                              height: "30px",
                              float: "left",
                              fontSize: "12px",
                              lineHeight: "10px",
                            }}
                          >
                            <a href={loanData?.bank_statement} target="_blank">
                              View Statement
                            </a>
                          </button>
                        </div>
                      </div>
                      <hr />
                      <div className="row profileData">
                        <label
                          className="col-sm-4 col-form-label"
                          htmlFor="basic-default-name"
                        >
                          <span>TIN Number</span>
                        </label>
                        <div className="col-sm-7 mt-2">
                          <span>{loanData?.tin_number}</span>
                        </div>
                      </div>
                      <hr />
                      <div className="row profileData">
                        <label
                          className="col-sm-4 col-form-label"
                          style={{ paddingBottom: "10px" }}
                          htmlFor="basic-default-name"
                        >
                          <span>Status</span>
                        </label>
                        <div className="col-sm-7 mt-2">

                          {loanData?.status === "submitted" && (
                            <span
                            className="badge rounded-pill bg-primary px-2"
                            style={{ fontSize: "9px" }}
                          >
                            Submitted
                          </span>
                          )}

                          {loanData?.status === "review" && (
                             <span
                             className="badge rounded-pill bg-info px-2"
                             style={{ fontSize: "9px" }}
                           >
                             Review
                           </span>
                          )}

                          {loanData?.status === "processing" && (
                            <span className="badge rounded-pill bg-warning px-2" style={{ fontSize: '9px', }}>
                            Processing
                          </span>
                          )}

                          {loanData?.status === "rejected" && (
                            <span className="badge rounded-pill bg-danger px-2" style={{ fontSize: '9px', }}>
                            Rejected
                          </span>
                          )}

                          {loanData?.status === "eligible" && (
                             <span className="badge rounded-pill bg-success px-2" style={{ fontSize: '9px', }}>
                             Eligible
                           </span>
                          )}

                          {loanData?.status === "rejected" ? (
                            <>
                              <button
                                type="button"
                                className="btn btn-outline-primary"
                                data-bs-dismiss="modal"
                                onClick={rejectionModal}
                                style={{
                                  width: "120px",
                                  height: "30px",
                                  float: "right",
                                  fontSize: "12px",
                                  lineHeight: "10px",
                                }}
                              >
                                View Reason
                              </button>
                            </>
                          ) : (
                            <></>
                          )}
                        </div>

                        <div
                          style={{ paddingTop: "20px", paddingBottom: "10px" }}
                        >
                          {loanData?.status === "submitted" ||
                          loanData?.status === "review" ||
                          loanData?.status === "processing" ? (
                            <>
                              <button
                                type="button"
                                className="btn btn-outline-success"
                                onClick={updateStatus}
                                style={{
                                  width: "200px",
                                  height: "40px",
                                  float: "right",
                                  fontSize: "13px",
                                }}
                              >
                                {(loanData?.status === "submitted" &&
                                  "Change to Review") ||
                                  (loanData?.status === "review" &&
                                    "Change to Processing") ||
                                  (loanData?.status === "processing" &&
                                    "Approve")}
                              </button>
                            </>
                          ) : (
                            ""
                          )}
                          {loanData?.status === "processing" && (
                            <>
                              <button
                                type="button"
                                className="btn btn-outline-danger mx-2"
                                data-bs-dismiss="modal"
                                onClick={rejectionModal}
                                style={{
                                  width: "150px",
                                  height: "40px",
                                  float: "right",
                                }}
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {loanData?.status === "submitted" ||
                          loanData?.status === "review" ? (
                            <>
                              <button
                                type="button"
                                className="btn btn-outline-secondary mx-2"
                                onClick={() => setshow(false)}
                                data-bs-dismiss="modal"
                                style={{
                                  width: "100px",
                                  height: "40px",
                                  float: "right",
                                }}
                              >
                                Close
                              </button>
                            </>
                          ) : (
                            ""
                          )}
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

      <Modal
        show={showRejectionForm}
        onHide={() => setShowRejectionForm(false)}
      >
        <div className="modal-content">
          <div className="modal-header">
            <button
              type="button"
              onClick={() => setShowRejectionForm(false)}
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div className="card-body">
            <div style={{ paddingTop: "10px" }}>
              <h5>Rejected Reason</h5>
              <ReactQuill
                value={loanData?.rejection_reason}
                onChange={handleReason}
              />
              <button
                type="button"
                className="btn btn-success waves-effect waves-light ms-2"
                data-bs-dismiss="modal"
                onClick={updateStatus}
                style={{
                  width: "100px",
                  height: "40px",
                  marginTop: "15px",
                  float: "right",
                  marginBottom: "10px",
                }}
              >
                Save
              </button>
              <button
                type="button"
                className="btn btn-waves-effect waves-light"
                onClick={() => setShowRejectionForm(false)}
                data-bs-dismiss="modal"
                style={{
                  width: "100px",
                  height: "40px",
                  marginTop: "15px",
                  float: "right",
                  marginBottom: "10px",
                  backgroundColor: "grey", 
                  color: "white"
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default LoanApplicationPage;
