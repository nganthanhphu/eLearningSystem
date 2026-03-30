import factory
from elearning.models import Assignment
from elearning.tests.factories.lesson_factory import LessonFactory

class AssignmentFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Assignment

    title = factory.Sequence(lambda n: f"Assignment {n}")
    content = factory.Faker("text")
    lesson = factory.SubFactory(LessonFactory)