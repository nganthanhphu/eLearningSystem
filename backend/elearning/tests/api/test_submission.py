from django.urls import reverse
from rest_framework import status
from elearning.tests.base import BaseAPITestCase
from elearning.models import Submission
class SubmissionAPITestCase(BaseAPITestCase):

    def test_student_create_submission_success(self):
        assignment = self.create_assignment()
        self.enroll_student(course=assignment.lesson.course)
        self.auth(self.student)
        url = reverse("submission-list")
        res = self.client.post(url, {"assignment": assignment.id, "content": "My submission"})
        submission = Submission.objects.get(id=res.data["id"])

        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res.data["assignment"]["id"], assignment.id)
        self.assertEqual(submission.student, self.student)

    def test_student_create_submission_not_enrolled_forbidden(self):
        assignment = self.create_assignment()
        self.auth(self.student)
        url = reverse("submission-list")
        res = self.client.post(url, {"assignment": assignment.id, "content": "My submission"})

        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_student_update_own_submission_success(self):
        submission = self.create_submission()
        self.auth(self.student)
        url = reverse("submission-detail", args=[submission.id])
        res = self.client.patch(url, {"content": "Updated content"})

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["content"], "Updated content")
        self.assertIsNone(res.data.get("grade"))
        self.assertIsNone(res.data.get("comment"))

    def test_student_update_other_submission_forbidden(self):
        submission = self.create_submission()
        other_student = self.create_student()
        self.auth(other_student)
        url = reverse("submission-detail", args=[submission.id])
        res = self.client.patch(url, {"content": "Try update"})

        self.assertEqual(res.status_code, status.HTTP_404_NOT_FOUND)

    def test_teacher_update_any_submission_success(self):
        submission = self.create_submission()
        self.auth(self.teacher)
        url = reverse("submission-detail", args=[submission.id])
        res = self.client.patch(url, {"grade": 9, "comment": "Good work"})

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data["grade"], 9)
        self.assertEqual(res.data["comment"], "Good work")

    def test_authenticated_can_list_submissions(self):
        submission = self.create_submission()
        self.auth(self.student)
        url = reverse("submission-list")
        res = self.client.get(url)
        ids = [s["id"] for s in res.data["results"]]

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn(submission.id, ids)

    def test_unauthenticated_forbidden(self):
        self.logout()
        url = reverse("submission-list")
        res = self.client.get(url)

        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)