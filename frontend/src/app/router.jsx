import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Course from "../pages/Course";
import Enrollments from "../pages/student/Enrollments";
import Lessons from "../pages/student/Lessons";
import Assignments from "../pages/student/Assignments";
import Submission from "../pages/student/Submission";
import ProtectedRoute from "../components/ProtectedRoute";
import { ROLES } from "../config/roles";
import TLessons from "../pages/teacher/CourseDetail";
import TAssignments from "../pages/teacher/Assignments";
import TSubmission from "../pages/teacher/TSubmission";
import TSubmissionDetail from "../pages/teacher/TSubmissionDetail";
import SAllSubmission from "../pages/student/SAllSubmission";
import ProfileBase from "../pages/profiles/ProfileBase";
import ProfileEdit from "../pages/profiles/ProfileEdit";
import ProfileSecurity from "../pages/profiles/ProfileSecurity";
import { Navigate } from "react-router-dom";
import Certificates from "../pages/student/Certificates";
import CertificateCard from "../pages/student/CertificateCard";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/courses" element={<Course />} />
      <Route
        path="/student/enrollments"
        element={
          <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
            <Enrollments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/certificates"
        element={
          <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
            <Certificates />
          </ProtectedRoute>
        }
      />
      <Route
        path="/certificates/:cerId"
        element={
          <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
            <CertificateCard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/courses/:courseId/lessons"
        element={
          <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
            <Lessons />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/lessons/:lessonId/assignments"
        element={
          <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
            <Assignments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/assignments/:assignmentId/submission"
        element={
          <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
            <Submission />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/submissions"
        element={
          <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
            <SAllSubmission />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/courses/:courseId/lessons"
        element={
          <ProtectedRoute allowedRoles={[ROLES.TEACHER]}>
            <TLessons />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/lessons/:lessonId/assignments"
        element={
          <ProtectedRoute allowedRoles={[ROLES.TEACHER]}>
            <TAssignments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/submissions"
        element={
          <ProtectedRoute allowedRoles={[ROLES.TEACHER]}>
            <TSubmission />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/submissions/:submissionId"
        element={
          <ProtectedRoute allowedRoles={[ROLES.TEACHER]}>
            <TSubmissionDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/me"
        element={
          <ProtectedRoute allowedRoles={[ROLES.STUDENT, ROLES.TEACHER]}>
            <ProfileBase />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="edit" replace />} />
        <Route path="edit" element={<ProfileEdit />} />
        <Route path="security" element={<ProfileSecurity />} />
      </Route>
    </Routes>
  );
}
