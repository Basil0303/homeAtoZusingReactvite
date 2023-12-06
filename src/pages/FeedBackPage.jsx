import React, { useEffect } from "react";
import { useState } from "react";
import { apiCall } from "../Services/ApiCall";
import { FeedbackUrl } from "../Services/baseUrl";
import Loader from "../components/Loader/Loader";

function FeedBackPage() {
  const [list, setList] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [params, setParams] = useState({
    page: 1,
    limit: 3,
  });
  const [loading, setLoading] = useState(true);

  const [pagination, setPagination] = useState({
    hasNextPage: false,
    hasPreviousPage: false,
    totalDocs: 0,
  });

  //----------------------------get list------------------------------
  const getList = async () => {
    try {
      setIsLoading(true);
      const response = await apiCall("get", FeedbackUrl, {}, params);
      const { hasNextPage, hasPreviousPage, totalDocs, docs } = response?.data;
      setList(docs ?? []);
      setPagination({ hasNextPage, hasPreviousPage, totalDocs });
    } finally {
      setIsLoading(false);
    }
  };

  //----------------------------useEffect------------------------------
  useEffect(() => {
    getList();
  }, [params]);

  return (
    <div>
          {isLoading ? (
        <Loader/>
      ):
      <div className="col-xl-12">
        <div className="card dz-card" id="bootstrap-table11">
          <h4 className="card-title mx-5 mt-5 ">Feedback</h4>
          <div className="card-header">
            <div className="feedback-container mt-5 mb-5">
              {loading ? (
                // Show loader while data is being fetched
                <div className="feedback-container mx-3 mt-5 mb-5 d-flex align-items-center justify-content-center">
                  
                </div>
              ) : list.length ? (
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
                <div className="feedback-container mx-3 mt-5 mb-5 d-flex align-items-center justify-content-center">
                  <b>No data</b>
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
}
    </div>
  );
}

export default FeedBackPage;
