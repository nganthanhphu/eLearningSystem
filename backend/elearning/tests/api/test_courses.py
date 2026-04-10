from django.urls import reverse
from rest_framework import status

from elearning.models import UserRole
from elearning.tests.base import BaseAPITestCase
from elearning.tests.factories.user_factory import UserFactory
class CourseAPITestCase(BaseAPITestCase):

    def setUp(self):
        super().setUp()
        self.list_url = reverse("course-list")

    def test_create_course_student_forbidden(self):
        self.auth(self.student)
        res = self.client.post(self.list_url, {
            "title": "Course A"
        })

        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_course_unauthenticated(self):
        self.logout()
        res = self.client.post(self.list_url, {})

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


    def test_retrieve_course_student_forbidden(self):
        course = self.create_course()
        url = reverse("course-detail", args=[course.id])
        self.auth(self.student)
        res = self.client.get(url)

        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_course_not_owner_teacher_forbidden(self):
        other_teacher = self.create_teacher()
        course = self.create_course(teacher=other_teacher)
        url = reverse("course-detail", args=[course.id])
        self.auth(self.teacher)
        res = self.client.patch(url, {"title": "Hack"})
        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_course_student_forbidden(self):
        course = self.create_course()
        url = reverse("course-detail", args=[course.id])
        self.auth(self.student)
        res = self.client.patch(url, {"title": "Updated"})

        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)


    def test_delete_course_not_owner_forbidden(self):
        course = self.create_course()
        url = reverse("course-detail", args=[course.id])
        self.auth(self.student)
        res = self.client.delete(url)

        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)



    def test_student_not_enroll_course_get_lessons_forbidden(self):
        course=self.create_course()
        self.create_lesson(course=course)
        other_student=self.create_student()
        self.auth(other_student)
        url = reverse("course-get-lessons", args=[course.id])
        res=self.client.get(url)

        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

