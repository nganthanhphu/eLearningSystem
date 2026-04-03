from django.urls import reverse
from rest_framework import status
from elearning.tests.base import BaseAPITestCase

class FlowTestCase(BaseAPITestCase):
    def setUp(self):
        super().setUp()

    def test_retrieve_lesson_enrolled_student_success(self):
        flow = self.create_enrolled_flow()
        lesson = flow["lesson"]
        url = reverse("lesson-detail", args=[lesson.id])
        self.auth(self.student)
        res = self.client.get(url)

        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_get_assignments_enrolled_student_success(self):
        flow = self.create_enrolled_flow()
        lesson = flow["lesson"]
        self.create_assignment(lesson=lesson)
        url = reverse("lesson-get-assignments", args=[lesson.id])
        self.auth(self.student)
        res = self.client.get(url)

        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_retrieve_assignment_enrolled_student_success(self):
        flow = self.create_enrolled_flow()
        assignment = flow["assignment"]
        url = reverse("assignment-detail", args=[assignment.id])
        self.auth(self.student)
        res = self.client.get(url)

        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_student_full_learning_flow(self):
        flow = self.create_submission_flow()
        self.auth(self.student)

        res = self.client.get(
            reverse("lesson-detail", args=[flow["lesson"].id]))
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        res = self.client.get(
            reverse("lesson-get-assignments", args=[flow["lesson"].id]))
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        res = self.client.get(
            reverse("assignment-detail", args=[flow["assignment"].id]))
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        res = self.client.get(
            reverse("assignment-get-submission", args=[flow["assignment"].id]))
        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_get_submission_student_success(self):
        flow = self.create_submission_flow()
        assignment = flow["assignment"]
        submission = flow["submission"]
        url = reverse("assignment-get-submission", args=[assignment.id])
        self.auth(self.student)
        res = self.client.get(url)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["id"], submission.id)

    def test_get_submission_student_no_submission(self):
        flow = self.create_enrolled_flow()
        assignment = flow["assignment"]
        url = reverse("assignment-get-submission", args=[assignment.id])
        self.auth(self.student)
        res = self.client.get(url)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["assignment"], None)

    def test_student_view_course_lessons_flow(self):
        flow = self.create_enrolled_flow()
        self.auth(self.student)
        res = self.client.get(
            reverse("course-get-lessons", args=[flow["course"].id]))

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("results", res.data)

    def test_student_no_certificate_flow(self):
        self.auth(self.student)
        res = self.client.get(reverse("certificate-list"))

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data["results"]), 0)

    def test_student_view_certificate_list_flow(self):
        flow = self.create_full_flow_with_certificate()
        self.auth(self.student)

        res = self.client.get(reverse("certificate-list"))

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data["results"]), 1)

    def test_student_retrieve_certificate_flow(self):
        flow = self.create_full_flow_with_certificate()
        self.auth(self.student)

        res = self.client.get(
            reverse("certificate-detail", args=[flow["certificate"].id]))

        self.assertEqual(res.status_code, status.HTTP_200_OK)


