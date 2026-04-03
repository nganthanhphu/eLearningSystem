from django.urls import reverse
from rest_framework import status
from elearning.tests.base import BaseAPITestCase


class LessonAPITestCase(BaseAPITestCase):

    def setUp(self):
        super().setUp()

    def test_retrieve_lesson_teacher_success(self):
        lesson = self.create_lesson()
        url = reverse("lesson-detail", args=[lesson.id])
        self.auth(self.teacher)
        res = self.client.get(url)

        self.assertEqual(res.status_code, status.HTTP_200_OK)

    def test_retrieve_lesson_not_enrolled_student_forbidden(self):
        lesson = self.create_lesson()
        url = reverse("lesson-detail", args=[lesson.id])
        self.auth(self.student)
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_assignments_teacher_success(self):
        lesson = self.create_lesson()
        self.create_assignment(lesson=lesson)
        url = reverse("lesson-get-assignments", args=[lesson.id])
        self.auth(self.teacher)
        res = self.client.get(url)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("results", res.data)




    def test_get_assignments_not_enrolled_student_forbidden(self):
        lesson = self.create_lesson()
        self.create_assignment(lesson=lesson)
        url = reverse("lesson-get-assignments", args=[lesson.id])
        self.auth(self.student)
        res = self.client.get(url)

        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)