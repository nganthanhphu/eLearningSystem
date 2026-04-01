import axios from "axios";

const HOST = process.env.REACT_APP_BASE_URL;

export const endpoints = {
  register: "/users/",
  "current-user": "/users/current-user/",
  login: "/o/token/",

  courses: "/courses/",
  "course-detail": (id) => `/courses/${id}/`,

  lessons: (courseId) => `/courses/${courseId}/lessons/`,
  "lesson-detail": (courseId, lessonId) =>
    `/courses/${courseId}/lessons/${lessonId}/`,

  assignments: (lessonId) => `/lessons/${lessonId}/assignments/`,
  "assignment-detail": (assignmentId) => `/assignments/${assignmentId}/`,

  submissions: (assignmentId) => `/assignments/${assignmentId}/submissions/`,
  "submission-detail": (submissionId) => `/submissions/${submissionId}/`,

  certificates: "/certificates/",
  "certificate-detail": (id) => `/certificates/${id}/`,

  enrollments: "/enrollments/",
};

export const authApis = (token) => {
  return axios.create({
    baseURL: HOST,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default axios.create({
  baseURL: HOST,
});
