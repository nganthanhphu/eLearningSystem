from django.urls import reverse
from rest_framework import status
from elearning.tests.base import BaseAPITestCase


class CertificatePermissionTestCase(BaseAPITestCase):

    def setUp(self):
        super().setUp()
        self.list_url = reverse("certificate-list")

    def test_student_only_sees_own_certificates(self):
        own_enrollment = self.enroll_student(student=self.student)
        self.create_certificate(enrollment=own_enrollment)

        other_student = self.create_student()
        other_enrollment = self.enroll_student(student=other_student)
        self.create_certificate(enrollment=other_enrollment)

        self.auth(self.student)
        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_teacher_cannot_access(self):
        self.auth(self.teacher)
        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_cannot_access(self):
        self.logout()
        response = self.client.get(self.list_url)

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_student_cannot_retrieve_others_certificate(self):
        other_student = self.create_student()
        enrollment = self.enroll_student(student=other_student)
        cert = self.create_certificate(enrollment=enrollment)
        self.auth(self.student)
        url = reverse("certificate-detail", args=[cert.id])
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)