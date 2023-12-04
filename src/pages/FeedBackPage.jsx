import React, { useEffect } from "react";
import { useState } from "react";
import { apiCall } from "../Services/ApiCall";
import { FeedbackUrl } from "../Services/baseUrl";

function FeedBackPage() {
  const [list, setList] = useState("");
  const [params, setParams] = useState({
    page: 1,
    limit: 3,
  });
  const [pagination, setPagination] = useState({
    hasNextPage: false,
    hasPreviousPage: false,
    totalDocs: 0,
  });

  //----------------------------get list------------------------------
  const getList = async () => {
    const response = await apiCall("get", FeedbackUrl, {}, params);
    const { hasNextPage, hasPreviousPage, totalDocs, docs } = response?.data;
    setList(docs ?? []);
    setPagination({ hasNextPage, hasPreviousPage, totalDocs });
  };

  //----------------------------useEffect------------------------------
  useEffect(() => {
    getList();
  }, [params]);

  return (
    <div>
      <div className="col-xl-12">
        <div className="card dz-card" id="bootstrap-table11">
          {/* <div className="card-header flex-wrap">
            <h4 className="card-title ">Feedback</h4>
            <div className="mt-5 mb-5" style={{ width: "80%", margin: "10%" }}>
              <tbody>
                {list.length ? (
                  <>
                    {list.map((item, key) => {
                      return (
                        <tr key={item._id}>
                          <div className="border rounded border-3 p-3 m-2">
                            <div className="d-flex justify-content-end fw-normal">
                              {item.feedback_type.replace(/_/g, " ")}
                            </div>
                            <div className="mx-1" style={{ margin: "-22px" }}>
                              <div className="mb-1 fw-normal fw-bolder">
                                {item.name}
                              </div>

                              <div className="mb-5  fw-normal">
                                {item.email}
                              </div>
                            </div>
                  
                            <div
                              className="text-muted "
                              style={{ lineHeight: "2" }}
                            >
                              {item.feedback}
                            </div>
                          </div>
                        </tr>
                      );
                    })}
                  </>
                ) : (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center" }}>
                      <b> No Data Found</b>{" "}
                    </td>
                  </tr>
                )}
              </tbody>
            </div>
          </div> */}
          <div className="card-header">
            <h4 className="card-title mb-8">Feedback</h4>
            <div className="feedback-container mt-5 mb-5">
              {list.length ? (
                list.map((item) => (
                  <div key={item._id} className="feedback-card">
                    <div className="feedback-type">
                      {item.feedback_type.replace(/_/g, " ")}
                    </div>
                    <div className="feedback-details">
                      <div className="name">{item.name}</div>
                      <div className="email">{item.email}</div>
                      <div className="text-muted">{item.feedback}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="feedback-card no-data">
                  <b>No Data Found</b>
                </div>
              )}
            </div>
          </div>

          {/* ------- pagination------------------------------- */}
          <div className="d-flex justify-content-end mx-4 mb-4">
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
        </div>
      </div>
    </div>
  );
}

export default FeedBackPage;
