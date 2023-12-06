import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { AddSettingsUrl, SettingsUrl } from "../Services/baseUrl";
import { apiCall } from "../Services/ApiCall";
import { useNavigate } from "react-router-dom";
import { Show_Toast } from "../utils/Toast";
import { Button } from "react-bootstrap";
import Loader from "../components/Loader/Loader";

function AddSettings() {
  const navigate = useNavigate();
  const [settingDetail, SetsettingDetail] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  ///------------------get settings--------------------------
  const getSettings = async () => {
    setIsLoading(true)
    try {
      const response = await apiCall("get", SettingsUrl);
      if (response.status === true) {
        setIsLoading(false)
        SetsettingDetail(response?.data?.docs[0]);
      } else {
        console.log("No settings found.");
      }
    } catch (error) {
      console.log(error);
    }
  };
  //---------------- create or edit settings----------------------------

  const saveOrUpdateSettings = async () => {
    try {
      
      if (settingDetail?._id) {
        const updatedData = await apiCall(
          "put",
          `${SettingsUrl}/${settingDetail._id}`,
          settingDetail
        );

        if (updatedData.status === true) {
          Show_Toast("Updated Successfully", true);
          navigate("/Settings");
        }
      } else {
        const addedData = await apiCall("post", AddSettingsUrl, settingDetail);

        if (addedData.status === true) {
          Show_Toast("Added Successfully", true);
          navigate("/Settings");
        }
      }
    } catch (error) {
      console.error("Error saving or updating settings:", error);
    }
  };

  useEffect(() => {
    getSettings();
  }, []);

  return (
    <>
      {isLoading ? (
        <Loader/>
      ) : (
      <div className="col-xl-12 col-lg-12 ">
        <div className="card">
          <div className="card-header">
            <h4 className="card-title">Add Details</h4>
          </div>
          <div className="card-body">
            <div className="basic-form">
              <form>
                <div className="row">
                  <h4>
                    <i
                      className="fas fa-headset fa-2x "
                      style={{ color: "blue", marginRight: "10px" }}
                    />
                    Customer Support
                  </h4>
                  <div className="mb-3 col-md-6">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email"
                      required
                      value={settingDetail?.customer_support?.email}
                      onChange={(e) =>
                        SetsettingDetail({
                          ...settingDetail,
                          customer_support: {
                            ...settingDetail.customer_support,
                            email: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label className="form-label">Mobile Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="Mobile Number"
                      required
                      value={settingDetail?.customer_support?.phone}
                      onChange={(e) =>
                        SetsettingDetail({
                          ...settingDetail,
                          customer_support: {
                            ...settingDetail.customer_support,
                            phone: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
                <div className="row">
                  <h4>
                    <i
                      className="far fa-calendar-alt fa-2x "
                      style={{ color: "blue", marginRight: "10px" }}
                    />
                    Business Hours
                  </h4>{" "}
                  <label htmlFor="timr">(9:00 AM To 6:00 PM)</label>
                  <div className="mb-3 col-md-6">
                    <label htmlFor="fromTime" className="form-label">
                      From Time
                    </label>

                    <input
                      type="text"
                      id="fromTime"
                      name="fromTime"
                      className="form-control"
                      required
                      value={
                        settingDetail?.business_hours?.monday_to_friday?.from ||
                        "-"
                      }
                      onChange={(e) =>
                        SetsettingDetail({
                          ...settingDetail,
                          business_hours: {
                            ...settingDetail.business_hours,
                            monday_to_friday: {
                              ...settingDetail.business_hours.monday_to_friday,
                              from: e.target.value,
                            },
                          },
                        })
                      }
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label htmlFor="toTime" className="form-label">
                      To Time
                    </label>
                    <input
                      required
                      type="text"
                      id="toTime"
                      name="toTime"
                      className="form-control"
                      value={
                        settingDetail?.business_hours?.monday_to_friday?.to ||
                        "-"
                      }
                      onChange={(e) =>
                        SetsettingDetail({
                          ...settingDetail,
                          business_hours: {
                            ...settingDetail.business_hours,
                            monday_to_friday: {
                              ...settingDetail.business_hours.monday_to_friday,
                              to: e.target.value,
                            },
                          },
                        })
                      }
                    />
                  </div>
                  <h6>staturday</h6>
                  <div className="mb-3 col-md-6">
                    <label htmlFor="fromTime" className="form-label">
                      From Time
                    </label>
                    <input
                      required
                      type="text"
                      id="fromTime"
                      name="fromTime"
                      className="form-control"
                      value={
                        settingDetail?.business_hours?.saturday?.from || ""
                      }
                      onChange={(e) =>
                        SetsettingDetail({
                          ...settingDetail,
                          business_hours: {
                            ...settingDetail.business_hours,
                            saturday: {
                              ...settingDetail.business_hours.saturday,
                              from: e.target.value,
                            },
                          },
                        })
                      }
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label htmlFor="toTime" className="form-label">
                      To Time
                    </label>
                    <input
                      required
                      type="text"
                      id="toTime"
                      name="toTime"
                      className="form-control"
                      value={settingDetail?.business_hours?.saturday?.to || ""}
                      onChange={(e) =>
                        SetsettingDetail({
                          ...settingDetail,
                          business_hours: {
                            ...settingDetail.business_hours,
                            saturday: {
                              ...settingDetail.business_hours.saturday,
                              to: e.target.value,
                            },
                          },
                        })
                      }
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <h6 className="form-label">Sunday</h6>
                    <select
                      className="form-select"
                      required
                      value={settingDetail?.business_hours?.sunday}
                      onChange={(e) =>
                        SetsettingDetail({
                          ...settingDetail,
                          business_hours: {
                            ...settingDetail.business_hours,
                            sunday: e.target.value,
                          },
                        })
                      }
                    >
                      <option value="open">Open</option>
                      <option value="close">Close</option>
                    </select>
                  </div>
                </div>
                <div className="row">
                  <h4>
                    <i
                      className="fas fa-map-marker-alt fa-2x "
                      style={{ color: "blue", marginRight: "10px" }}
                    />
                    Location
                  </h4>
                  <div className="mb-3 col-md-6">
                    <label htmlFor="locationName">Location Name:</label>
                    <input
                      type="text"
                      id="locationName"
                      className="form-control"
                      value={settingDetail?.location?.location_name}
                      onChange={(e) =>
                        SetsettingDetail({
                          ...settingDetail,
                          location: {
                            ...settingDetail.location,
                            location_name: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="mb-3 col-md-2">
                    <label htmlFor="latitude">Latitude:(10.258711)</label>
                    <input
                      type="text"
                      id="latitude"
                      className="form-control"
                      value={settingDetail?.location?.latitude}
                      onChange={(e) =>
                        SetsettingDetail({
                          ...settingDetail,
                          location: {
                            ...settingDetail.location,
                            latitude: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div className="mb-3 col-md-2">
                    <label htmlFor="longitude">Longitude:(76.319762)</label>
                    <input
                      type="text"
                      id="longitude"
                      className="form-control"
                      value={settingDetail?.location?.longitude}
                      onChange={(e) =>
                        SetsettingDetail({
                          ...settingDetail,
                          location: {
                            ...settingDetail.location,
                            longitude: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="row">
                  <h4>
                    <i
                      className="fas fa-shield  fa-2x "
                      style={{ color: "blue", marginRight: "10px" }}
                    />
                    Privacy Policy
                  </h4>
                  <div className="mb-3 col-md-6">
                    <div>
                      <ReactQuill
                        value={settingDetail?.privacy_policy}
                        onChange={(content) =>
                          SetsettingDetail((prevSettingDetail) => ({
                            ...prevSettingDetail,
                            privacy_policy: content,
                          }))
                        }
                        style={{ width: "200%", height: "200px" }}
                      />
                    </div>
                  </div>
                </div>
                <div className="row" style={{ marginTop: "40px" }}>
                  <h4>
                    <i
                      className="fas fa-question-circle  fa-2x "
                      style={{ color: "blue", marginRight: "10px" }}
                    />
                    FAQ
                  </h4>
                  <div className="mb-3 col-md-6">
                    <div>
                      <ReactQuill
                        value={settingDetail?.faq}
                        onChange={(content) =>
                          SetsettingDetail((prevSettingDetail) => ({
                            ...prevSettingDetail,
                            faq: content,
                          }))
                        }
                        style={{ width: "200%", height: "200px" }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ margin: "40px 0" }}></div>

                <div className="row" style={{ marginBottom: "40px" }}>
                  <h4>
                    <i
                      className="fas fa-file-contract fa-2x "
                      style={{ color: "blue", marginRight: "10px" }}
                    />
                    Terms and Conditions
                  </h4>
                  <div className="mb-3 col-md-6">
                    <div>
                      <ReactQuill
                        value={settingDetail?.terms_and_conditions}
                        onChange={(content) =>
                          SetsettingDetail((prevSettingDetail) => ({
                            ...prevSettingDetail,
                            terms_and_conditions: content,
                          }))
                        }
                        style={{ width: "200%", height: "200px" }}
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              <Button
                variant="dark"
                className="btn btn-waves-effect waves-light"
                style={{ marginTop: "50px" }}
                onClick={() => {
                  navigate("/settings");
                }}
              >
                Back
              </Button>

              <button
                className="btn btn-success waves-effect waves-light ms-2"
                onClick={saveOrUpdateSettings}
                style={{ marginTop: "50px" }}
              >
                {settingDetail?._id ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      </div>
      )}
    </>
  );
}

export default AddSettings;
