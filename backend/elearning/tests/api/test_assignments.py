from django.urls import reverse
from rest_framework import status
from elearning.tests.base import BaseAPITestCase


class AssignmentAPITestCase(BaseAPITestCase):

    def test_retrieve_assignment_teacher_success(self):
        assignment = self.create_assignment()
        url = reverse("assignment-detail", args=[assignment.id])
        self.auth(self.teacher)
        res = self.client.get(url)

        self.assertEqual(res.status_code, status.HTTP_200_OK)


    def test_retrieve_assignment_enrolled_student_success(self):
        flow = self.create_enrolled_flow()
        assignment = flow["assignment"]
        url = reverse("assignment-detail", args=[assignment.id])
        self.auth(self.student)
        res = self.client.get(url)

        self.assertEqual(res.status_code, status.HTTP_200_OK)


    def test_retrieve_assignment_not_enrolled_student_forbidden(self):
        assignment = self.create_assignment()
        url = reverse("assignment-detail", args=[assignment.id])
        self.auth(self.student)
        res = self.client.get(url)

        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)




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


    def test_get_submission_teacher_forbidden(self):
        assignment = self.create_assignment()
        url = reverse("assignment-get-submission", args=[assignment.id])
        self.auth(self.teacher)
        res = self.client.get(url)

        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)