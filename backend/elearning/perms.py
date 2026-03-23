from rest_framework.permissions import IsAuthenticated

from elearning.models import UserRole


class IsTeacher(IsAuthenticated):
    def has_permission(self, request, view):
        return super().has_permission(request, view) and request.user.role == UserRole.TEACHER


class IsStudent(IsAuthenticated):
    def has_permission(self, request, view):
        return super().has_permission(request, view) and request.user.role == UserRole.STUDENT

class IsSubmissionOwner(IsAuthenticated):
    def has_object_permission(self, request, view, submission):
        return super().has_object_permission(request, view, submission) and submission.student == request.user