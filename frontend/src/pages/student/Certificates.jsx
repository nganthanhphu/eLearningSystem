import PaginationControls from "../../components/PaginationControls";
import { useNavigate } from "react-router-dom";
import { useCertificates } from "../../hooks/useCertificate";

export default function Certificates() {
  const {
    certificates,
    loading,
    next,
    previous,
    goToNextPage,
    goToPreviousPage,
  } = useCertificates();

  const navigate = useNavigate();

  const handleClick = (cerId) => {
    navigate(`/certificates/${cerId}`);
  };

  return (
    <>
      <h2 className="mb-3">Các chứng chỉ đã đạt được </h2>
      {loading ? (
        <p className="text-center text-muted">
          Đang tải danh sách chứng chỉ...
        </p>
      ) : certificates.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "20px",
          }}
        >
          {certificates.map((value, index) => {
            return (
              <div
                key={index}
                className="card shadow-sm border-1 rounded h-100"
                style={{ cursor: "pointer" }}
                onClick={() => handleClick(value?.id)}
              >
                <div className="card-body">
                  <h5 className="card-title fw-bold text-primary">
                    {value?.course}
                  </h5>
                  <hr />
                  <h6 className="mb-0 mb-2">
                    Ngày nhận:{" "}
                    {new Date(value?.issued_at).toLocaleDateString("vi-VN")}
                  </h6>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-muted">
          Bạn chưa nhận được chứng chỉ nào{" "}
        </p>
      )}
      <PaginationControls
        onPrevious={goToPreviousPage}
        onNext={goToNextPage}
        hasPrevious={!!previous}
        hasNext={!!next}
      />
    </>
  );
}
