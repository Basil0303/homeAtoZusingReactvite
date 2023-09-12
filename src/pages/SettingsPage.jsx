import React, { useEffect, useState } from "react";
import { apiCall } from "../Services/ApiCall";
import { SettingsUrl } from "../Services/baseUrl";
import DOMPurify from "dompurify";

import { useNavigate } from "react-router-dom";
function SettingsPage() {
  const navigate = useNavigate();

  const [settingDetails, setSettingDetails] = useState([]);
  console.log(settingDetails, "Settings  details");
  const [details,setDetails]=useState({})
console.log(details,"details........................")
  useEffect(() => {
    getSettings();
  }, []);
  const getSettings = async () => {
    try {
      const response = await apiCall("get", SettingsUrl);
      console.log(response, "repsonse from settings");
      setSettingDetails(response.data.docs);
    } catch (error) {}
  };

  function sanitizeAndConvertToPlainText(html) {
    const sanitizedHTML = DOMPurify.sanitize(html);
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = sanitizedHTML;
    return tempDiv.textContent || tempDiv.innerText || "";
  }

 
  return (
    <div>
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            {/* start page title */}
            <div className="row">
              <div className="col-12">
                <div className="page-title-box d-flex align-items-center justify-content-between">
                  <h4 className="mb-0 font-size-18">Settings</h4>
                  <button
  className="btn btn-success waves-effect waves-light"
  type="submit"
  onClick={() => {
    navigate("/addsettings");
  }}
>
  Add
</button>

                </div>
                <br />
              </div>
            </div>
            {/* end page title */}
            <div className="checkout-tabs">
              <div className="row">
                <div className="col-lg-2">
                  <div
                    className="nav flex-column nav-pills"
                    id="v-pills-tab"
                    role="tablist"
                    aria-orientation="vertical"
                  >
                    <a
                      className="nav-link active"
                      id="v-pills-gen-ques-tab"
                      data-bs-toggle="pill"
                      href="#v-pills-gen-ques"
                      role="tab"
                      aria-controls="v-pills-gen-ques"
                      aria-selected="true"
                    >
                      <i
                        className="fas fa-home  fa-3x"
                        style={{ color: "white" || "black" }}
                      />
                      <p className="fw-bold mb-4">Generals</p>
                    </a>
                    <a
                      className="nav-link"
                      id="v-pills-privacy-tab"
                      data-bs-toggle="pill"
                      href="#v-pills-privacy"
                      role="tab"
                      aria-controls="v-pills-privacy"
                      aria-selected="false"
                    >
                      <i
                        className="fas fa-shield fa-3x"
                        style={{ color: "white" || "black" }}
                      />
                      <p className="fw-bold mb-4">Privacy Policy</p>
                    </a>
                    <a
                      className="nav-link"
                      id="v-pills-support-tab"
                      data-bs-toggle="pill"
                      href="#v-pills-support"
                      role="tab"
                      aria-controls="v-pills-support"
                      aria-selected="false"
                    >
                      <i
                        className="fas fa-question-circle fa-3x"
                        style={{ color: "white" || "black" }}
                      />
                      <p className="fw-bold mb-4">FAQ</p>
                    </a>
                    <a
                      className="nav-link"
                      id="v-pills-TermsandConditions-tab"
                      data-bs-toggle="pill"
                      href="#v-pills-TermsandConditions"
                      role="tab"
                      aria-controls="v-pills-TermsandConditions"
                      aria-selected="false"
                    >
                      <i
                        className="fas fa-file-contract fa-3x"
                        style={{ color: "white" || "black" }}
                      />
                      <p className="fw-bold mb-4">Terms and Conditions</p>
                    </a>
                  </div>
                </div>
                <div className="col-lg-10">
                  <div className="card">
                    <div className="card-body">
                      <div className="tab-content" id="v-pills-tabContent">
                        <div
                          className="tab-pane fade show active"
                          id="v-pills-gen-ques"
                          role="tabpanel"
                          aria-labelledby="v-pills-gen-ques-tab"
                        >
                          <div className="d-flex align-items-center">
                            <i class="fas fa-home fa-2x me-2"></i>
                            <h4 className="card-title">Generals</h4>
                          </div>
                          <br />
                          <hr />
                          {settingDetails.map((value) => (
                            <div className="row" key={value}>
                              <div className="col-sm-4">
                                <div className="card">
                                  <div className="card-body">
                                    <div className="ds-head">
                                      <i
                                        className="fas fa-headset fa-3x"
                                        style={{ color: "blue" }}
                                      />
                                    </div>
                                    <div className="text">
                                      <h3>Customer Support</h3>

                                      <hr />
                                      <h4>Email:</h4>
                                      <h5>{value?.customer_support?.email}</h5>
                                      <h4>Phone Number:</h4>
                                      <h5>{value?.customer_support?.phone}</h5>
                                      {/* <button
          onClick={() => {
            setShow(true);
          }}
          className="btn btn-primary btn-sm "
        >
          Add
        </button> */}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="col-sm-4">
                                <div className="card">
                                  <div className="card-body">
                                    <div className="ds-head">
                                      <i
                                        className="far fa-calendar-alt fa-3x"
                                        style={{ color: "blue" }}
                                      />
                                    </div>

                                    <div className="">
                                      <h3>Business Hours</h3>
                                      <hr />
                                      <h4>Moday to Friday:</h4>
                                      <h6>
                                        {value?.business_hours?.monday_to_friday?.from} To {value?.business_hours?.monday_to_friday?.to}
                                      </h6>
                                      <h4>Saturday:</h4>
                                      <h6>{value?.business_hours?.saturday?.from} To {value?.business_hours?.saturday?.to}</h6>
                                      <h4>Sunday:</h4>
                                      <h6>{value?.business_hours?.sunday}</h6>
                                      {/* <button
                                        onClick={() => {
                                          setShows(true);
                                        }}
                                        className="btn btn-primary btn-sm"
                                      >
                                        Add
                                      </button> */}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="col-sm-4">
                                <div className="card">
                                  <div className="card-body">
                                    <div className="ds-head">
                                      <i
                                        className="fas fa-map-marker-alt fa-3x"
                                        style={{ color: "blue" }}
                                      ></i>{" "}
                                    </div>
                                    <div className="">
                                      <h3>Locations</h3>
                                      <hr />
                                      <h6>{value?.location?.location_name}</h6>
                                      {/* <button
                                        onClick={() => {
                                          setShowModal(true);
                                        }}
                                        className="btn btn-primary btn-sm "
                                      >
                                        Add
                                      </button> */}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        {settingDetails.map((privacy) => (
                          <div
                            className="tab-pane fade"
                            id="v-pills-privacy"
                            role="tabpanel"
                            aria-labelledby="v-pills-privacy-tab"
                          >
                            <div className="d-flex align-items-center">
                              <i class="fas fa-shield fa-2x me-2"></i>
                              <h4 className="card-title">Privacy Policy</h4>
                            </div>
                            <br />
                            <hr />

                            <div className="App">
                              <p
                                style={{
                                  fontSize: "16px",
                                  color: "#333",
                                  lineHeight: 1.5,
                                  marginBottom: "20px",
                                }}
                              >
                                {sanitizeAndConvertToPlainText(
                                  privacy?.privacy_policy
                                )}
                              </p>
                            </div>
                          </div>
                        ))}

                        {settingDetails.map((faq) => (
                          <div
                            className="tab-pane fade"
                            id="v-pills-support"
                            role="tabpanel"
                            aria-labelledby="v-pills-support-tab"
                          >
                            <h4 className="card-title mb-5">FAQ</h4>
                            <hr />
                            <div>
                              <p
                                style={{
                                  fontSize: "16px",
                                  color: "#333",
                                  lineHeight: 1.5,
                                  marginBottom: "20px",
                                }}
                              >
                                {sanitizeAndConvertToPlainText(faq?.faq)}
                              </p>
                            </div>
                          </div>
                        ))}

                        {settingDetails.map((terms) => (
                          <div
                            className="tab-pane fade"
                            id="v-pills-TermsandConditions"
                            role="tabpanel"
                            aria-labelledby="v-pills-TermsandConditions-tab"
                          >
                            <h4 className="card-title mb-5">
                              Terms & Conditions
                            </h4>
                            <hr />
                            <div>
                              <p
                                style={{
                                  fontSize: "16px",
                                  color: "#333",
                                  lineHeight: 1.5,
                                  marginBottom: "20px",
                                }}
                              >
                                {sanitizeAndConvertToPlainText(
                                  terms?.terms_and_conditions
                                )}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* end row */}
          </div>{" "}
          {/* container-fluid */}
        </div>
        {/* End Page-content */}
      </div>
    </div>
  );
}

export default SettingsPage;
