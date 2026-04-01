import { useParams } from "react-router-dom";
import { useCertificateCard } from "../../hooks/useCertificateCard";
export default function CertificateCard() {
  const { cerId } = useParams();
  const { certificateCard } = useCertificateCard(cerId);
  const handlePrint = () => {
    window.print();
  };
  if (certificateCard === null) return <h1>Chứng chỉ không tồn tại </h1>;
  return (
    <>
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            #certificate, #certificate * {
              visibility: visible;
            }
            #certificate {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
            }
          }
        `}
      </style>
      <div id="certificate">
        <div className="container d-flex justify-content-center align-items-center vh-100 bg-light">
          <div
            id="certificate"
            className="bg-white text-center p-5 shadow-lg"
            style={{
              width: "800px",
              border: "8px solid #d4af37", // gold border
              borderRadius: "10px",
            }}
          >
            {/* Header */}
            <h5 className="text-uppercase text-muted">
              Certificate of Completion
            </h5>

            <h1 className="fw-bold mt-3">Chứng nhận hoàn thành</h1>

            {/* Body */}
            <p className="mt-4">This is to certify that</p>

            <h2 className="fw-bold text-primary">
              {certificateCard?.last_name} {certificateCard?.first_name}
            </h2>

            <p className="mt-3">has successfully completed the course</p>

            <h3 className="fw-semibold">{certificateCard?.course}</h3>

            <p className="mt-3 text-muted">
              Date:{" "}
              {new Date(certificateCard?.issued_at).toLocaleDateString("vi-VN")}
            </p>

            {/* Footer */}
            <div className="row mt-5">
              <div className="col text-start">
                <p className="mb-0">___________________</p>
                <small>Instructor</small>
              </div>

              <div className="col text-end">
                <p className="mb-0">___________________</p>
                <small>Director</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2"
        onClick={handlePrint}
      >
        In chứng chỉ
      </button>
    </>
  );
}
