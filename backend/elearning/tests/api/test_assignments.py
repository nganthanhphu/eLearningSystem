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


    def test_retrieve_assignment_not_enrolled_student_forbidden(self):
        assignment = self.create_assignment()
        url = reverse("assignment-detail", args=[assignment.id])
        self.auth(self.student)
        res = self.client.get(url)

        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_submission_teacher_forbidden(self):
        assignment = self.create_assignment()
        url = reverse("assignment-get-submission", args=[assignment.id])
        self.auth(self.teacher)
        res = self.client.get(url)

        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)