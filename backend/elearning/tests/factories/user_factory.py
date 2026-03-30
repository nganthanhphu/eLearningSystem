
import factory
from django.contrib.auth import get_user_model
from elearning.models import UserRole

User = get_user_model()


class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    username = factory.Sequence(lambda n: f"user{n}")
    email = factory.LazyAttribute(lambda o: f"{o.username}@test.com")

    first_name = "Test"
    last_name = "User"

    role = UserRole.STUDENT

    avatar ="image/upload/v1234567890/test_avatar.jpg"

    dob = factory.Faker("date_of_birth")
    gender = "MALE"

    @factory.post_generation
    def password(self, create, extracted, **kwargs):
        password = extracted or "123456"
        self.set_password(password)
        if create:
            self.save()