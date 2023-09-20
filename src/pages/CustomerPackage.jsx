import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiCall } from "../Services/ApiCall";
import { PackageApplicationUrl } from "../Services/baseUrl";

function CustomerPackage() {
  const [list, setList] = useState("");
  const [params, setParams] = useState({
    page: 1,
    limit: 10,
    query: "",
  });
  const [pagination, setpagination] = useState({
    hasNextPage: false,
    hasPreviousPage: false,
    totalDocs: 0,
  });

  //-----------------------------------get packages--------------------------
  const { userId } = useParams();
  const getPackages = async () => {
    const response = await apiCall(
      "get",
      `${PackageApplicationUrl}/${userId}`,
      { params }
    );
    console.log("result", response);
    const { hasNextPage, hasPreviousPage, totalDocs, docs } = response?.data;
    setList(docs ?? []);
    setpagination({ hasNextPage, hasPreviousPage, totalDocs });
  };

  //---------------------------------useEffect----------------------------------
  useEffect(() => {
    getPackages();
  }, [params]);
  
  return (
    <div>
      <div className="col-xl-12">
        <div className="card dz-card" id="bootstrap-table11">
          <div className="card-header flex-wrap d-flex justify-content-between">
            <div>
              <h4 className="card-title">Package Table</h4>
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
                    <thead className="text-left">
                      <tr>
                        {/* <th>SL.No</th> */}
                        <th></th>
                        <th>Name</th>
                        <th>Home Type Name</th>
                        <th>Price Per Sqft</th>
                        <th>Square Feet</th>
                        <th>Plan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {!list ? (
                        <tr>
                          <td colSpan={6} className="text-center py-4">
                            <div className="spinner-border" role="status">
                              <span className="sr-only">Loading...</span>
                            </div>
                          </td>
                        </tr>
                      ) : list?.length ? (
                        <>
                          {list.map((item, key) => (
                            <tr key={item._id}>
                              {/* <td>
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
                              </td> */}
                              <td style={{ width: "2%" }}>
                                <img
                                  src={item?.cover_image ?? "images/user.webp"}
                                  width={42}
                                  height={42}
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
                              <td>{item?.square_feet}</td>
                              <td>
                                <a href="">{item.plan}</a>
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
                            <b>No Packages</b>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

        {/* ----------------------------------pagination---------------------------------- */}
          <div className="d-flex justify-content-end mx-4 mb-3">
            <button
              className="btn btn-sm btn-primary"
              disabled={pagination.hasPreviousPage == false}
              onClick={() => setParams({ ...params, page: params.page - 1 })}
            >
              <i className="fa-solid fa-angle-left" />
            </button>

            <button
              className="btn btn-sm btn-primary mx-1"
              disabled={pagination.hasNextPage == false}
              onClick={() => setParams({ ...params, page: params.page + 1 })}
            >
              <i className="fa-solid fa-angle-right" />
            </button>
          </div>
        {/* -------------------------------pagination ends------------------------------- */}
        </div>
      </div>
    </div>
  );
}

export default CustomerPackage;
