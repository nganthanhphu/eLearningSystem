from rest_framework.permissions import IsAuthenticated

from elearning.models import Assignment, Course, Enrollment, Lesson, UserRole


class IsTeacher(IsAuthenticated):
    def has_permission(self, request, view):
        return super().has_permission(request, view) and request.user.role == UserRole.TEACHER


class IsStudent(IsAuthenticated):
    def has_permission(self, request, view):
        return super().has_permission(request, view) and request.user.role == UserRole.STUDENT


def _is_enrolled(student, course):
    return Enrollment.objects.filter(student=student, course=course).exists()


class IsSubmissionOwner(IsAuthenticated):
    def has_object_permission(self, request, view, submission):
        return super().has_object_permission(request, view, submission) and submission.student == request.user


class IsCourseTeacher(IsAuthenticated):
    def has_object_permission(self, request, view, course):
        return super().has_object_permission(request, view, course) and course.teacher == request.user


class IsEnrolledStudentForCourseContent(IsStudent):
    def has_object_permission(self, request, view, course):
        return super().has_permission(request, view) and _is_enrolled(request.user, course)


class IsEnrolledStudentForLesson(IsStudent):
    def has_object_permission(self, request, view, lesson):
        return super().has_object_permission(request, view, lesson) and _is_enrolled(request.user, lesson.course)


class IsEnrolledStudentForAssignment(IsStudent):
    def has_object_permission(self, request, view, assignment):
        return super().has_object_permission(request, view, assignment) and _is_enrolled(request.user,
                                                                                         assignment.lesson.course)


class IsEnrolledStudentForAssignmentSubmission(IsStudent):
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False

        if view.action == 'create':
            assignment_id = request.data.get('assignment')
            if not assignment_id:
                return False
            try:
                assignment = Assignment.objects.select_related('lesson__course').get(id=assignment_id)
                return _is_enrolled(request.user, assignment.lesson.course)
            except Assignment.DoesNotExist:
                return False

        return True


class IsEnrolledStudentForLessonContent(IsAuthenticated):
    def has_object_permission(self, request, view, lesson):
        return super().has_object_permission(request,view,lesson) and _is_enrolled(request.user, lesson.course)
