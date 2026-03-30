import factory
from elearning.models import Enrollment
from elearning.tests.factories.user_factory import UserFactory
from elearning.tests.factories.course_factory import CourseFactory

class EnrollmentFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Enrollment

    student = factory.SubFactory(UserFactory, role="STUDENT")
    course = factory.SubFactory(CourseFactory)