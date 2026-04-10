from rest_framework.permissions import IsAuthenticated

from elearning.models import Assignment, Course, Enrollment, Lesson, UserRole


class IsTeacher(IsAuthenticated):
    def has_permission(self, request, view):
        return super().has_permission(request, view) and request.user.role == UserRole.TEACHER


class IsStudent(IsAuthenticated):
    def has_permission(self, request, view):
        return super().has_permission(request, view) and request.user.role == UserRole.STUDENT


class IsSubmissionOwner(IsAuthenticated):
    def has_object_permission(self, request, view, submission):
        return super().has_object_permission(request, view, submission) and submission.student == request.user


class IsCourseTeacher(IsAuthenticated):
    def has_object_permission(self, request, view, course):
        return super().has_object_permission(request, view, course) and course.teacher == request.user


class IsEnrolledStudentForCourseContent(IsStudent):
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False

        course_id = view.kwargs.get('pk')
        return Enrollment.objects.filter(student=request.user, course_id=course_id).exists()


class IsEnrolledStudentForLesson(IsAuthenticated):
    def has_object_permission(self, request, view, lesson):
        return Enrollment.objects.filter(student=request.user, course__lessons__id=lesson.id).exists()


class IsEnrolledStudentForAssignment(IsAuthenticated):
    def has_object_permission(self, request, view, assignment):
        return Enrollment.objects.filter(student=request.user, course__lessons__assignments__id=assignment.id).exists()


class IsEnrolledStudentForAssignmentSubmission(IsAuthenticated):
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False

        if view.action == 'create':
            assignment_id = request.data.get('assignment')
            if not assignment_id:
                return False
            return Enrollment.objects.filter(student=request.user, course__lessons__assignments__id=assignment_id).exists()

        return True


class IsEnrolledStudentForLessonContent(IsStudent):
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False

        lesson_id = view.kwargs.get('pk')
        return Enrollment.objects.filter(
            student=request.user,
            course__lessons__id=lesson_id
        ).exists()


class IsCourseTeacherForLesson(IsAuthenticated):
    def has_object_permission(self, request, view, lesson):
        return Course.objects.filter(teacher=request.user, lessons__id=lesson.id).exists()

class IsCourseTeacherForAssignment(IsAuthenticated):
    def has_object_permission(self, request, view, assignment):
        return Course.objects.filter(teacher=request.user, lessons__assignments__id=assignment.id).exists()

class IsCourseTeacherForSubmission(IsAuthenticated):
    def has_object_permission(self, request, view, submission):
        return Course.objects.filter(teacher=request.user, lessons__assignments__submissions__id=submission.id).exists()

class IsCourseTeacherForCourseContent(IsTeacher):
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False

        course_id = view.kwargs.get('pk')
        return Course.objects.filter(teacher=request.user, id=course_id).exists()   
    
class IsCourseTeacherForLessonContent(IsTeacher):
    def has_permission(self, request, view):
        if not super().has_permission(request, view):
            return False

        lesson_id = view.kwargs.get('pk')
        return Course.objects.filter(teacher=request.user, lessons__id=lesson_id).exists()
    