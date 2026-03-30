from django.urls import reverse
from rest_framework import status
from elearning.tests.base import BaseAPITestCase
from elearning.models import UserRole
from django.contrib.auth import get_user_model

User = get_user_model()


class UserAPITestCase(BaseAPITestCase):
    def setUp(self):
        super().setUp()
        self.register_url = reverse("user-list")
        self.current_user_url = reverse("user-get-current-user")

    def test_get_current_user_without_login(self):
        self.logout()
        res = self.client.get(self.current_user_url)

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_current_user_success(self):
        self.auth(self.student)
        res = self.client.get(self.current_user_url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["username"], self.student.username)

    def test_create_user_success(self):
        data = {
            "username": "newuser",
            "password": "123456",
            "email": "newuser@test.com",
            "first_name": "New",
            "last_name": "User",
            "role": UserRole.STUDENT,
            "avatar":"image/upload/v1234567890/test_avatar.jpg"
        }

        res = self.client.post(self.register_url, data)

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

        user = User.objects.get(username="newuser")

        self.assertEqual(user.role, UserRole.STUDENT)

        self.assertTrue(user.check_password("123456"))

    def test_register_ignore_role_field(self):
        data = {"username": "newuser",
                "password": "123456",
                "email": "newuser@test.com",
                "first_name": "New",
                 "last_name": "User",
                "role": UserRole.TEACHER,
                "avatar": "image/upload/v1234567890/test_avatar.jpg"
                }

        res = self.client.post(self.register_url, data)

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)


        user = User.objects.get(username="newuser")

        self.assertEqual(user.role,UserRole.STUDENT)


