import factory
from elearning.models import Lesson
from elearning.tests.factories.course_factory import CourseFactory

class LessonFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Lesson

    title = factory.Sequence(lambda n: f"Lesson {n}")
    content = factory.Faker("text")
    course = factory.SubFactory(CourseFactory)
    video_url = factory.Faker("url")