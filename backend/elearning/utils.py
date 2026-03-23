from elearning.models import UserRole, Submission
from elearning.serializers import StudentSubmissionSerializer, TeacherSubmissionSerializer


class RoleMapper:
    @staticmethod
    def get_submission_serializer(user):
        MAPPING = {
            UserRole.STUDENT : StudentSubmissionSerializer,
            UserRole.TEACHER : TeacherSubmissionSerializer
        }
        return MAPPING.get(user.role, None)

    @staticmethod
    def get_submission_queryset(user, queryset):
        MAPPING = {
            UserRole.STUDENT : lambda qs: qs.filter(student=user),
            UserRole.TEACHER : lambda qs: qs.filter(assignment__lesson__course__teacher=user)
        }
        return MAPPING.get(user.role, lambda qs: qs)(queryset)