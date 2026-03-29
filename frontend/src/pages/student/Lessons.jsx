import React from "react";
import { useParams } from "react-router-dom";
import { useLessons } from "../../hooks/useLessons";
import PaginationControls from "../../components/PaginationControls";
import { useNavigate } from "react-router-dom";

const Lessons = () => {
    const { courseId } = useParams();
    const { lessons, loading, next, previous, goToNextPage, goToPreviousPage } = useLessons(courseId);
    const navigate = useNavigate();

    return (
        <>
            <h2 className="mb-3">Danh sách bài học</h2>
            {loading ? (
                <p className="text-center text-muted">Đang tải danh sách bài học...</p>
            ) : lessons.length > 0 ? (
                <ul className="list-group mb-3">
                    {lessons.map((lesson) => (
                        <li key={lesson.id} className="list-group-item d-flex justify-content-between align-items-center">
                            <span>{lesson.title}</span>
                            <div>
                                <a href={lesson.video_url} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm me-2">
                                    Học ngay
                                </a>
                                <button className="btn btn-primary btn-sm"
                                    onClick={() => navigate(`/student/lessons/${lesson.id}/assignments`)}>
                                    Bài tập
                                </button>
                            </div>

                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-muted">Chưa có bài học nào</p>
            )}
            <PaginationControls
                onPrevious={goToPreviousPage}
                onNext={goToNextPage}
                hasPrevious={!!previous}
                hasNext={!!next}
            />
        </>
    );
};

export default Lessons;
