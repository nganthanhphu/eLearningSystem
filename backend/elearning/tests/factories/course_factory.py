import factory
from elearning.models import Course
from elearning.tests.factories.user_factory import UserFactory

class CourseFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Course

    title = factory.Sequence(lambda n: f"Course {n}")
    description = factory.Faker("paragraph")
    teacher = factory.SubFactory(UserFactory, role="TEACHER")