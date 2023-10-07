import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { AddSettingsUrl, SettingsUrl } from "../Services/baseUrl";
import { apiCall } from "../Services/ApiCall";
import { useNavigate } from "react-router-dom";
import { ShowToast } from "../utils/Toast";
import { Button } from "react-bootstrap";

function AddSettings() {
   const[id,setId]=useState('');
   const navigate = useNavigate();


   const [settings, setSettings] = useState({
    customer_support: {
      email: "",
      phone: "",
    },
    business_hours: {
      monday_to_friday: {
        from: "",
        to: "",
      },
      saturday: {
        from: "",
        to: "",
      },
      sunday: {},
    },
    privacy_policy: '' ,
    faq:'',
    terms_and_conditions:'',
  });
  const handleChange = (html) => {
    setSettings({ ...settings,privacy_policy: html });
  };
  const handleChangeFaq=(html)=>{
    setSettings({ ...settings,faq: html });

  };
  const handleChangeTerms=(html)=>{
    setSettings({...settings,terms_and_conditions:html})
  };
  


  const getSettings = async () => {
    try {
      const response = await apiCall("get", SettingsUrl);
      const settingDetail = response.data.docs; 

      if (settingDetail) {
        settingDetail.customer_support = {
          email: settingDetail[0]?.customer_support?.email,
          phone: settingDetail[0]?.customer_support?.phone,
        };
        settingDetail.business_hours = {
          monday_to_friday: {
            from: settingDetail[0]?.business_hours?.monday_to_friday?.from,
            to: settingDetail[0]?.business_hours?.monday_to_friday?.to,
          },
          saturday: {
            from: settingDetail[0]?.business_hours?.saturday?.from,
            to: settingDetail[0]?.business_hours?.saturday?.to,
          },
          sunday: settingDetail[0]?.business_hours?.sunday,
        };
        settingDetail.location = {
          location_name: settingDetail[0]?.location?.location_name,
          latitude:settingDetail[0]?.location?.latitude,
          longitude:settingDetail[0]?.location?.longitude
        };
        settingDetail.privacy_policy = settingDetail[0]?.privacy_policy;
        settingDetail.faq = settingDetail[0]?.faq;
        settingDetail.terms_and_conditions =
          settingDetail[0]?.terms_and_conditions;
        setSettings( ...settingDetail);
        setId(settingDetail[0]._id)
      }
    } catch (error) {
      console.log(error);
    }
  };

  const AddSettingsDetails = async () => {
    try {
      const data = await apiCall("post", AddSettingsUrl, settings);
      console.log(data, "data to add");
      if (data.status === true) {
        ShowToast("Added Successfully", true);
        navigate("/Settings");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateDetails=async()=>{
    if(id){
      try {
        const updatedata= await apiCall("put",`${SettingsUrl}/${id}`,settings)
        console.log(updatedata,"sdfsdfsdfsdfsdfsdfsfdfs")
        if (updatedata.status === true) {
          ShowToast("Updated Successfully", true);
          navigate("/Settings");
        }
      } catch (error) {
        console.log(error);

      }
    };

  };
  useEffect(() => {
    getSettings();
  }, []);


  

  return (
    <div>
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
                      value={settings?.customer_support?.email}
                      onChange={(e) =>
                        setSettings((prevSettings) => ({
                          ...prevSettings,
                          customer_support: {
                            ...prevSettings?.customer_support,
                            email: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label className="form-label">Mobile Number</label>
                    <input
                      type="tel"
                      className="form-control"
                      placeholder="Mobile Number"
                      value={settings?.customer_support?.phone}
                      required
                      onChange={(e) =>
                        setSettings((prevSettings) => ({
                          ...prevSettings,
                          customer_support: {
                            ...prevSettings?.customer_support,
                            phone: e.target.value,
                          },
                        }))
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
                         value={settings?.business_hours?.monday_to_friday?.from || ''}
                      onChange={(e) =>
                        setSettings((prevSettings) => ({
                          ...prevSettings,
                          business_hours: {
                            ...prevSettings?.business_hours,
                            monday_to_friday: {
                              ...prevSettings?.business_hours?.monday_to_friday,
                              from: e.target.value,
                            },
                          },
                        }))
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
                      

                      value={settings?.business_hours?.monday_to_friday?.to || ''}
                      onChange={(e) =>
                        setSettings((prevSettings) => ({
                          ...prevSettings,
                          business_hours: {
                            ...prevSettings?.business_hours,
                            monday_to_friday: {
                              ...prevSettings?.business_hours?.monday_to_friday,
                              to: e.target.value,
                            },
                          },
                        }))
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
                    
                      
                      value={settings?.business_hours?.saturday?.from || ''}    
                                        onChange={(e) =>
                        setSettings((prevSettings) => ({
                          ...prevSettings,
                          business_hours: {
                            ...prevSettings?.business_hours,
                            saturday: {
                              ...prevSettings?.business_hours?.saturday,
                              from: e.target.value,
                            },
                          },
                        }))
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

                      value={settings?.business_hours?.saturday?.to || ''}
                      onChange={(e) =>
                        setSettings((prevSettings) => ({
                          ...prevSettings,
                          business_hours: {
                            ...prevSettings?.business_hours,
                            saturday: {
                              ...prevSettings?.business_hours?.saturday,
                              to: e.target.value,
                            },
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <h6 className="form-label">Sunday</h6>
                    <select
                      className="form-select"
                      required
                      value={settings?.business_hours?.sunday}
                      onChange={(e) =>
                        setSettings((prevSettings) => ({
                          ...prevSettings,
                          business_hours: {
                            ...prevSettings?.business_hours,
                            sunday: e.target.value,
                          },
                        }))
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
      value={settings?.location?.location_name}
      onChange={(e) =>
        setSettings((prevSettings) => ({
          ...prevSettings,
          location: {
            ...prevSettings.location,
            location_name: e.target.value,
          },
        }))
      }
    />
  </div>
  <div className="mb-3 col-md-2">
    <label htmlFor="latitude">Latitude:(10.258711)</label>
    <input
      type="text"
      id="latitude"
      className="form-control"
      value={settings?.location?.latitude}
      onChange={(e) =>
        setSettings((prevSettings) => ({
          ...prevSettings,
          location: {
            ...prevSettings.location,
            latitude: e.target.value,
          },
        }))
      }
    />
  </div>
  <div className="mb-3 col-md-2">
    <label htmlFor="longitude">Longitude:(76.319762)</label>
    <input
      type="text"
      id="longitude"
      className="form-control"
      value={settings?.location?.longitude}
      onChange={(e) =>
        setSettings((prevSettings) => ({
          ...prevSettings,
          location: {
            ...prevSettings.location,
            longitude: e.target.value,
          },
        }))
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
                     value={settings?.privacy_policy}
                     onChange={handleChange}
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
        value={settings?.faq}
        onChange={handleChangeFaq}
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
        value={settings?.terms_and_conditions}
        onChange={handleChangeTerms}
        style={{ width: "200%", height: "200px" }}
      />
    </div>
  </div>
</div>

            
               
              </form>
            </div>
           
   <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
   <Button
   variant="dark" 
  className="btn btn-waves-effect waves-light"
  style={{ marginTop: "50px"}} 
  onClick={() => {
    navigate("/settings");
  }}
>
  Back
</Button>


  <button
    className="btn btn-success waves-effect waves-light ms-2"
    onClick={id ? updateDetails : AddSettingsDetails}
    style={{ marginTop: "50px" }}
  >
    {id ? 'Update' : 'Add'}
  </button>
</div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default AddSettings;
