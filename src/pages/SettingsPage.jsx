import React, { useEffect, useState } from "react";
import { apiCall } from "../Services/ApiCall";
import { SettingsUrl } from "../Services/baseUrl";
import moment from "moment";
import { useNavigate } from "react-router-dom";
function SettingsPage() {

  const navigate = useNavigate();
  const [settingDetails, setSettingDetails] = useState([]);

  const [loading, setLoading] = useState(true);

  const getSettings = async () => {
    try {
      const response = await apiCall("get", SettingsUrl);
      setSettingDetails(response.data.docs);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSettings();
  }, []);

  return (
    <div>
      
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <div className="page-title-box d-flex align-items-center justify-content-between">
                  <h4 className="mb-0 font-size-18">Settings</h4>
                  <button
                   size="sm" 
                    className="btn btn-success waves-effect waves-light"
                    type="submit"
                    onClick={() => {
                      navigate("/addsettings");
                    }}
                  >
                    {settingDetails?.length ? "Update" : "Add"}
                  </button>
                </div>
                <br />
              </div>
            </div>
                   {loading ? (
              // Show loading spinner while data is being fetched
              <div className="text-center py-4">
                <div className="spinner-border" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            ) : settingDetails.length === 0 ? (
        
              <div className="feedback-container mx-3 mt-5 mb-5 d-flex align-items-center justify-content-center">
                   <p>No setting details available.</p>
            </div>
            ) : (
              <div className="checkout-tabs">
                {settingDetails.map((value) => (
                  
                  <div className="row" key={value}>
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
                          <div style={{ marginTop: "20px" }}>
                            <i className="fas fa-home fa-3x " style = {{ color: "black", fontSize: "1.5em" }} />
                            <p className="fw-bold mb-4" style = {{ color: "black"}}>Generals</p>
                          </div>
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
                          <div style={{ marginTop: "20px" }}>
                            <i className="fas fa-shield fa-3x " style = {{ color: "black", fontSize: "1.5em" }} />
                            <p className="fw-bold mb-4" style = {{ color: "black"}}>Privacy Policy</p>
                          </div>
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
                          <div style={{ marginTop: "20px" }}>
                            <i className="fas fa-question-circle fa-3x" style = {{ color: "black", fontSize: "1.5em" }} />
                            <p className="fw-bold mb-4" style = {{ color: "black"}}>FAQ</p>
                          </div>
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
                          <div style={{ marginTop: "20px" }}>
                            <i className="fas fa-file-contract fa-3x" style = {{ color: "black", fontSize: "1.5em" }} />
                            <p className="fw-bold mb-4" style = {{ color: "black"}}>Terms and Conditions</p>
                          </div>
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
                                <h4 className="card-title">GENERALS</h4>
                              </div>

                              <hr />

                              <div className="row">
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
                                        <h4>
                                          Email :{" "}
                                          {value?.customer_support?.email ?? ""}
                                        </h4>

                                        <h4>
                                          Phone Number :{" "}
                                          {value?.customer_support?.phone ?? ""}
                                        </h4>
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
                                        <h4>
                                          Monday to Friday
                                          <h4>
                                            {value.business_hours.monday_to_friday.from.toUpperCase()}{" "}
                                            AM To{" "}
                                            {value.business_hours.monday_to_friday.to.toUpperCase()}{" "}
                                            PM
                                          </h4>
                                        </h4>

                                        <h4>
                                          Saturday
                                          <h4>
                                            {value?.business_hours?.saturday?.from.toUpperCase()}{" "}
                                            AM To{" "}
                                            {value?.business_hours?.saturday?.to.toUpperCase()}{" "}
                                            PM
                                          </h4>
                                        </h4>

                                        <h4>
                                          Sunday
                                          <h4>
                                            {value?.business_hours?.sunday ??
                                              ""}
                                          </h4>
                                        </h4>
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
                                        <h4>
                                          {value?.location?.location_name ?? ""}
                                        </h4>
                                        <h4>
                                          longitude :
                                          {value?.location?.longitude}
                                        </h4>
                                        <h4>
                                          latitude :{value?.location?.latitude}
                                        </h4>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div
                              className="tab-pane fade"
                              id="v-pills-privacy"
                              role="tabpanel"
                              aria-labelledby="v-pills-privacy-tab"
                            >
                              <div className="d-flex align-items-center">
                                <h4 className="card-title">PRIVACY POLICY</h4>
                              </div>
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
                                  {value?.privacy_policy ?? ""}
                                </p>
                              </div>
                            </div>

                            <div
                              className="tab-pane fade"
                              id="v-pills-support"
                              role="tabpanel"
                              aria-labelledby="v-pills-support-tab"
                              // key={faq?.id}
                            >
                              <h4 className="card-title">FAQ</h4>
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
                                  {value?.faq ?? ""}
                                </p>
                              </div>
                            </div>

                            <div
                              className="tab-pane fade"
                              id="v-pills-TermsandConditions"
                              role="tabpanel"
                              aria-labelledby="v-pills-TermsandConditions-tab"
                              // key={terms?.id}
                            >
                              <h4 className="card-title">
                                TERMS AND CONDITIONS
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
                                  {value?.terms_and_conditions ?? ""}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>{" "}
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
