import React from "react";

const PaginationControls = ({ onPrevious, onNext, hasPrevious, hasNext }) => {
  if (!hasPrevious && !hasNext) return null;

  return (
    <div className="d-flex justify-content-center mt-3 gap-3">
      {hasPrevious && (
        <button
          className="btn btn-primary"
          onClick={onPrevious}
          disabled={!hasPrevious}
        >
          Quay lại
        </button>
      )}
      {hasNext && (
        <button
          className="btn btn-primary"
          onClick={onNext}
          disabled={!hasNext}
        >
          Tiếp theo
        </button>
      )}
    </div>
  );
};

export default PaginationControls;
