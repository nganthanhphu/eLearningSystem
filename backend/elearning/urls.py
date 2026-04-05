from django.urls import include, path
from rest_framework.routers import DefaultRouter

from elearning.views import UserViewSet, CourseViewSet, LessonViewSet, AssignmentViewSet, EnrollmentViewSet, \
    SubmissionViewSet, CertificateViewSet

r = DefaultRouter()
r.register(r'users', UserViewSet, basename='user')
r.register(r'courses', CourseViewSet, basename='course')
r.register(r'lessons', LessonViewSet, basename='lesson')
r.register(r'assignments', AssignmentViewSet, basename='assignment')
r.register(r'enrollments', EnrollmentViewSet, basename='enrollment')
r.register(r'submissions', SubmissionViewSet, basename='submission')
r.register(r'certificates', CertificateViewSet, basename='certificate')
urlpatterns = [
    path('', include(r.urls)),
]
