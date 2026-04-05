from django.urls import reverse
from rest_framework import status
from elearning.tests.base import BaseAPITestCase
from elearning.models import Enrollment
class EnrollmentAPITestCase(BaseAPITestCase):

    def test_student_list_own_enrollments_success(self):
        enrollment = self.enroll_student(student=self.student)
        self.auth(self.student)
        url = reverse("enrollment-list")
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn(enrollment.id, [e["id"] for e in res.data["results"]])

    def test_student_create_enrollment_success(self):
        course = self.create_course()
        self.auth(self.student)
        url = reverse("enrollment-list")
        res = self.client.post(url, {"course": course.id})
        enrollment = Enrollment.objects.get(id=res.data["id"])

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(enrollment.course, course)
        self.assertEqual(enrollment.student, self.student)

    def test_teacher_list_enrollments_forbidden(self):
        self.auth(self.teacher)
        url = reverse("enrollment-list")
        res = self.client.get(url)

        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_teacher_create_enrollment_forbidden(self):
        course = self.create_course()
        self.auth(self.teacher)
        url = reverse("enrollment-list")
        res = self.client.post(url, {"course": course.id})

        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)