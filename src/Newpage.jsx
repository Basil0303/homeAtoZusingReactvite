<Modal show={show} size="lg" onHide={() => setshow(false) & setShowRejectionForm(false)}>
  <div className="modal-content">
    <div className="modal-header">
      <button type="button" onClick={() => setshow(false)} className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
    </div>
    <div className="card-body">
      <h5 className="modal-title mb-3" id="exampleModalLabel3">
        Applicant Details
      </h5>
      <table className="table">
        <tbody>
          <tr>
            <td className="col-md-6">
              <div className="row" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "200px" }}>
                <div className="col-5">
                  <img alt="user-avatar" src={loanData?.image} style={{ height: "170px", width: "130px", paddingBottom: "30px", borderRadius: "10%", paddingLeft: "5px", paddingTop: "5px" }} />
                </div>
                <div className="col-7">
                  <div>
                    <strong>Full Name:</strong> {loanData?.fullName}
                  </div>
                  <div>
                    <strong>Mobile:</strong> {loanData?.mobile}
                  </div>
                  <div>
                    <strong>Email:</strong> {loanData?.email}
                  </div>
                </div>
              </div>
            </td>
            <td className="col-md-6">
              <div className="card-bg">
                <div className="card mb-4">
                  <div className="card-body p-2">
                    <form style={{ paddingLeft: "10px", paddingRight: "10px" }}>
                      <TableRow label="District" value={loanData?.district} />
                      <TableRow label="Pincode" value={loanData?.pincode} />
                      <TableRow label="State" value={loanData?.state} />
                      <TableRow label="Status" value={renderStatusBadge(loanData?.user_status)} />
                    </form>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Add another table for "Application Details" here */}

    </div>
  </div>
</Modal>;

// TableRow component for better organization
const TableRow = ({ label, value }) => (
  <div className="row profileData">
    <label className="col-sm-4 col-form-label" style={{ paddingTop: "10px" }} htmlFor="basic-default-name">
      <strong>{label}</strong>
    </label>
    <div className="col-sm-7 mt-2">
      <span>{value}</span>
    </div>
  </div>
);

// Function to render status badge
const renderStatusBadge = (status) => {
  const statusMap = {
    new: { text: "New", className: "bg-primary" },
    submitted: { text: "Submitted", className: "bg-primary" },
    review: { text: "Review", className: "bg-info" },
    processing: { text: "Processing", className: "bg-warning" },
    rejected: { text: "Rejected", className: "bg-danger" },
    eligible: { text: "Eligible", className: "bg-success" },
    updating: { text: "Updating", className: "badge-dark border-0" },
  };

  return (
    <span className={`badge rounded-pill px-2 ${statusMap[status]?.className}`} style={{ fontSize: "9px" }}>
      {statusMap[status]?.text}
    </span>
  );
};
