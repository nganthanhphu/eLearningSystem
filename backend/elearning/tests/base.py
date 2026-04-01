from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from elearning.models import UserRole
from elearning.tests.factories.user_factory import UserFactory
from elearning.tests.factories.course_factory import CourseFactory
from elearning.tests.factories.lesson_factory import LessonFactory
from elearning.tests.factories.assignment_factory import AssignmentFactory
from elearning.tests.factories.enrollment_factory import EnrollmentFactory
from elearning.tests.factories.submission_factory import SubmissionFactory
from elearning.tests.factories.certificate_factory import CertificateFactory

User = get_user_model()
class BaseAPITestCase(APITestCase):
    def setUp(self):
        self.teacher = UserFactory(role=UserRole.TEACHER)
        self.student = UserFactory(role=UserRole.STUDENT)
    def auth(self, user):
        self.client.force_authenticate(user=user)

    def logout(self):
        self.client.force_authenticate(user=None)

    def create_student(self, **kwargs):
        return UserFactory(role=UserRole.STUDENT, **kwargs)


    def create_course(self, teacher=None, **kwargs):
        return CourseFactory(
            teacher=teacher or self.teacher,
            **kwargs
        )
    def create_lesson(self, course=None, **kwargs):
        return LessonFactory(
            course=course or self.create_course(),
            **kwargs
        )

    def create_assignment(self, lesson=None, **kwargs):
        return AssignmentFactory(
            lesson=lesson or self.create_lesson(),
            **kwargs
        )

    def enroll_student(self, student=None, course=None):
        return EnrollmentFactory(
            student=student or self.student,
            course=course or self.create_course()
        )

    def create_submission(self, student=None, assignment=None, **kwargs):
        student = student or self.student
        assignment = assignment or self.create_assignment()
        self.enroll_student(student=student, course=assignment.lesson.course)

        return SubmissionFactory(student=student, assignment=assignment,
            **kwargs)

    def create_certificate(self, enrollment=None):
        return CertificateFactory(
            enrollment=enrollment or self.enroll_student()
        )


    def create_course_flow(self):
        course = self.create_course()
        lesson = self.create_lesson(course=course)
        assignment = self.create_assignment(lesson=lesson)

        return {
            "course": course,
            "lesson": lesson,
            "assignment": assignment,
        }

    def create_enrolled_flow(self):
        course = self.create_course()
        lesson = self.create_lesson(course=course)
        assignment = self.create_assignment(lesson=lesson)
        enrollment = self.enroll_student(course=course)
        return {"course": course, "lesson": lesson, "assignment": assignment,
            "enrollment": enrollment, }

    def create_submission_flow(self):
        flow = self.create_enrolled_flow()

        submission = SubmissionFactory(student=self.student,
            assignment=flow["assignment"])

        flow["submission"] = submission
        return flow

    def create_full_flow_with_certificate(self):
        flow = self.create_submission_flow()
        certificate = CertificateFactory(enrollment=flow["enrollment"])
        flow["certificate"] = certificate
        return flow