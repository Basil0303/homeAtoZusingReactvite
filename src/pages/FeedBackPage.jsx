import React, { useEffect } from "react";
import { useState } from "react";
import { apiCall } from "../Services/ApiCall";
import { FeedbackUrl } from "../Services/baseUrl";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function FeedBackPage() {
  const [list, setList] = useState("");
  const [params, setParams] = useState({
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    hasNextPage: false,
    hasPreviousPage: false,
    totalDocs: 0,
  });
  const [remove, setRemove] = useState({
    show: false,
    id: null,
  });
  const modalClose = () => setShow(false);
  const handleClose = () => setRemove(false);

  //----------------------------get list------------------------------
  const getList = async () => {
    const response = await apiCall("get", FeedbackUrl,{},params);
    const { hasNextPage, hasPreviousPage, totalDocs, docs } = response?.data;
    setList(docs ?? []);
    setPagination({ hasNextPage, hasPreviousPage, totalDocs });
  };

  //---------------------------handleDelete---------------------------
  const handleDelete = async () => {
    const response = await apiCall("delete", `${FeedbackUrl}/${remove.id}`, {});
    setRemove({ show: false, id: null });
    getList();
  };

  //----------------------------useEffect------------------------------
  useEffect(() => {
    getList();
  }, [params]);

  return (
    <div>
      <div className="col-xl-12">
        <div className="card dz-card" id="bootstrap-table11">
          <div className="card-header flex-wrap d-flex justify-content-between">
            <div>
              <h4 className="card-title">Feedback</h4>
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
                    <thead>
                      <tr>
                        <th>SL.No</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Subject</th>
                        <th>Feedback Type</th>
                        <th>Feedback</th>
                        <th className="text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {list.length ? (
                        <>
                          {list.map((value, key) => {
                            return (
                              <tr key={value._id}>
                                <td>
                                  {params.page === 1
                                    ? key + 1 + params.limit * (params.page - 1)
                                    : params.limit * (params.page - 1) +
                                      (key + 1)}
                                </td>

                                <td>{value.name}</td>
                                <td>{value.email}</td>
                                <td>{value.subject}</td>
                                <td>{value.feedback_type}</td>
                                <td>{value.feedback}</td>
                                <td className="text-center">
                                  <i
                                    className="fa fa-trash"
                                    style={{ color: "red" }}
                                    title="Delete"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setRemove({
                                        ...remove,
                                        show: true,
                                        id: value._id,
                                      });
                                    }}
                                  >
                                   
                                  </i>
                                </td>
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
                  </table>
                </div>
              </div>
            </div>
          </div>
          {/* ---------------------pagination------------------------------- */}
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
          {/* --------------------------Pagination Ends--------------------- */}

          {/* --------------------------Delete Modal-------------------------*/}
          <Modal show={remove.show} onHide={modalClose}>
            <Modal.Body>
              <p>Are you sure you want to delete? </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleDelete}>
                Yes
              </Button>
              <Button variant="primary" onClick={handleClose}>
                No
              </Button>
            </Modal.Footer>
          </Modal>
           {/* --------------------------Delete Modal Ends-------------------------*/}
        </div>
      </div>
    </div>
  );
}

export default FeedBackPage;
