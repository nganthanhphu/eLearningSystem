import factory
from elearning.models import Submission
from elearning.tests.factories.user_factory import UserFactory
from elearning.tests.factories.assignment_factory import AssignmentFactory
from elearning.tests.factories.enrollment_factory import EnrollmentFactory

class SubmissionFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Submission

    student = factory.SubFactory(UserFactory, role="STUDENT")
    assignment = factory.SubFactory(AssignmentFactory)
    content = factory.Faker("text")

    @factory.post_generation
    def enroll(self, create, extracted, **kwargs):
        if create:
            EnrollmentFactory(student=self.student, course=self.assignment.lesson.course)