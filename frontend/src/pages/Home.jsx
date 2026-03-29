import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <>
      <div className="row">
        <div className="col-lg-8 col-md-10 mx-auto text-center py-5">
          <h1 className="display-3 fw-bold mb-4">
            Chào mừng bạn đến với hệ thống học trực tuyến ELearning System
          </h1>
          <p className="fs-5 mb-4">
            Học tập mọi lúc, mọi nơi với hàng trăm khóa học chất lượng cao từ các chuyên gia hàng đầu. Nâng cao kỹ năng, phát triển sự nghiệp và khám phá đam mê của bạn ngay hôm nay!
          </p>
          <button
            className="btn btn-primary text-white btn-lg rounded-pill px-5 py-3 fw-bold shadow-lg text-decoration-none"
            onClick={() => navigate('/courses')}
          >
            Xem các khóa học đang mở
          </button>
        </div>
      </div>
    </>
  );
}
