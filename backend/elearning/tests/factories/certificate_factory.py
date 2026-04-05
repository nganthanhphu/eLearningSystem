
import factory
from elearning.models import Certificate
from elearning.tests.factories.enrollment_factory import EnrollmentFactory

class CertificateFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Certificate

    enrollment = factory.SubFactory(EnrollmentFactory)