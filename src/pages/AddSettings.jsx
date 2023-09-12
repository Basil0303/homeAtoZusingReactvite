import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { AddSettingsUrl, SettingsUrl } from "../Services/baseUrl";
import { apiCall } from "../Services/ApiCall";


function AddSettings() {
  const [settingDetails, setSettingDetails] = useState([]);
  console.log(settingDetails,"setting details.............................")

  const[fromtime,setFromtime]=useState("");
 console.log(fromtime,"fromtime")
 const[totime,setTotime]=useState("");
 console.log(totime,"totime")
 const [settings, setSettings] = useState({
  customer_support:{
    email:''
  },
  business_hours: {
    monday_to_friday: {
      from:"",
      to:""
    },
    saturday:{
      from:"",
      to:""
    },
    sunday:{
    }
  }
});
console.log(settings,"settings")

useEffect(() => {
  getSettings();
}, []);


useEffect(()=>{
  if(settingDetails){
setSettings({
  customer_support:{
    email:settingDetails[0]?.customer_support?.email,
    phone:settingDetails[0]?.customer_support?.phone
  },
  business_hours:{
     monday_to_friday: {
            from :settingDetails[0]?.business_hours?.monday_to_friday?.from,
            to :settingDetails[0]?.business_hours?.monday_to_friday?.to
        },
        saturday:{
          from:settingDetails[0]?.business_hours?.from,
          to:settingDetails[0]?.business_hours?.to
        },
        sunday:{

        }
  }
})
  }

},[settingDetails])

 const AddSettingsDetails = async () => {
  try {
    console.log('working......')

    const data = await apiCall("post", AddSettingsUrl, { settings });
    console.log(settings,"settings")
    console.log('working......')
    console.log(data, "data to add");

    console.log(data, "data to add");
  } catch (error) {}
};
 
const getSettings = async () => {
  try {
    const response = await apiCall("get", SettingsUrl);
    console.log(response, "repsonse from settings");
    setSettingDetails(response.data.docs);
  } catch (error) {}
};

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
  value={settings?.customer_support?.email}
  onChange={(e) =>
    setSettings((prevSettings) => ({
      ...prevSettings,
      customer_support: {
        ...prevSettings.customer_support,
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

  onChange={(e) =>
    setSettings((prevSettings) => ({
      ...prevSettings,
      customer_support: {
        ...prevSettings.customer_support,
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
                  <div className="mb-3 col-md-6">
                    <label htmlFor="fromTime" className="form-label">
                      From Time
                    </label>
                    value={settings?.business_hours?.monday_to_friday?.from}

                    <input
                      type="time"
                      id="fromTime"
                      name="fromTime"
                      className="form-control"
                      value={settings?.business_hours?.monday_to_friday?.from}

          onChange={(e) =>
  setSettings((prevSettings) => ({
    ...prevSettings,
    business_hours: {
      ...prevSettings.business_hours,
      monday_to_friday: {
        ...prevSettings.business_hours.monday_to_friday, 
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
                      type="time"
                      id="toTime"
                      name="toTime"
                      className="form-control"
                 onChange={(e) =>
  setSettings((prevSettings) => ({
    ...prevSettings,
    business_hours: {
      ...prevSettings.business_hours,
      monday_to_friday: {
        ...prevSettings.business_hours.monday_to_friday,
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
                      type="time"
                      id="fromTime"
                      name="fromTime"
                      className="form-control"
                      onChange={(e) =>
                        setSettings((prevSettings) => ({
                          ...prevSettings,
                          business_hours: {
                            ...prevSettings.business_hours,
                            saturday: {
                              ...prevSettings.business_hours.saturday,
                              to: e.target.value, 
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
                      type="time"
                      id="toTime"
                      name="toTime"
                      className="form-control"
                      onChange={(e) =>
                        setSettings((prevSettings) => ({
                          ...prevSettings,
                          business_hours: {
                            ...prevSettings.business_hours,
                            saturday: {
                              ...prevSettings.business_hours.saturday,
                              from: e.target.value, 
                            },
                          },
                        }))
                      } 
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <h6 className="form-label">Sunday</h6>
                    <select className="form-select" 
                     onChange={(e) =>
                      setSettings((prevSettings) => ({
                        ...prevSettings,
                        business_hours: {
                          ...prevSettings.business_hours,
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
                    <input type="textarea" className="form-control" 
                     onChange={(e) =>
                      setSettings((prevSettings) => ({
                        ...prevSettings,
                        location: {
                          ...prevSettings.location,
                          location_name: e.target.value,
                        },
                      }))
                    }/>
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
  theme="snow"
  style={{ width: "200%", height: "200px"}}
  onChange={(content, delta, source) => {
    setSettings({
      ...settings,
      privacy_policy: content,
    });
  }}
 
/>

    </div>
  </div>
</div>

{/* Add space here */}
<div className="row" style={{ marginTop: "40px" }}>
  <h4>
    <i
      className="fas fa-question-circle fa-2x"
      style={{ color: "blue", marginRight: "10px" }}
    />
    FAQ
  </h4>
  <ReactQuill
    theme="snow"
    style={{ width: "200%", height: "200px", marginBottom: "40px" }}
    onChange={(content, delta, source) => {
      setSettings({
        ...settings,
        faq: content,
      });
    }}
  />
  <h4>
    <i
      className="fas fa-file-contract fa-2x"
      style={{ color: "blue", marginRight: "10px" }}
    />
    Terms & Conditions
  </h4>
  <ReactQuill
    theme="snow"
    style={{ width: "200%", height: "200px" }}
    onChange={(content, delta, source) => {
      setSettings({
        ...settings,
        terms_and_conditions: content,
      });
    }}
  />
</div>




     </form>
            </div>
            <button 
                    className="btn btn-success waves-effect waves-light" 
                    onClick={AddSettingsDetails}
                    style={{ marginTop: "50px" }}>Submit</button>
          </div>
        </div>
      </div>
     
      
    </div>
  );
}

export default AddSettings;
