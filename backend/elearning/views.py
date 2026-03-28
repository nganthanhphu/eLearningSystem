from drf_yasg.utils import swagger_auto_schema
from rest_framework import mixins, permissions, status
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet, ModelViewSet
from elearning import perms
from elearning.models import User, Course, Lesson, Assignment, Enrollment, Submission, Certificate
from elearning.paginators import ItemPaginator
from elearning.serializers import UserSerializer, CourseSerializer, LessonSerializer, AssignmentSerializer, \
    CertificateSerializer, EnrollmentSerializer, StudentSubmissionSerializer
from elearning.utils import RoleMapper


class UserViewSet(GenericViewSet, mixins.CreateModelMixin, mixins.RetrieveModelMixin):
    queryset = User.objects
    serializer_class = UserSerializer
    parser_classes = [MultiPartParser]

    def get_permissions(self):
        if self.action in ['retriever']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    @swagger_auto_schema(
        method='get',
        operation_summary='Get current user information',
        responses={200: 'UserSerializer'}
    )
    @swagger_auto_schema(
        method='patch',
        operation_summary='Update current user information',
        request_body=UserSerializer,
        responses={200: 'UserSerializer'}
    )
    @action(methods=['get', 'patch'], url_path='current-user', detail=False,
            permission_classes=[permissions.IsAuthenticated])
    def get_current_user(self, request):
        user = request.user
        if request.method.__eq__('PATCH'):
            data = request.data

            s = self.get_serializer(user, data=data, partial=True)
            s.is_valid(raise_exception=True)
            s.save()

        return Response(self.get_serializer(user).data, status=status.HTTP_200_OK)


class CourseViewSet(ModelViewSet):
    queryset = Course.objects.filter(active=True).select_related('teacher').order_by('-created_at').filter(active=True)
    pagination_class = ItemPaginator
    permission_classes = [perms.IsTeacher]
    serializer_class = CourseSerializer
    http_method_names = ['get', 'post', 'patch', 'delete']

    def get_queryset(self):
        queryset = super().get_queryset()
        if hasattr(self.request.user, 'role'):
            queryset = RoleMapper.get_course_queryset(self.request.user, queryset)
        kw = self.request.query_params.get('kw')
        if kw:
            queryset = queryset.filter(title__icontains=kw)
        if self.action.__eq__('get_lessons'):
            queryset = queryset.prefetch_related('lessons')
        return queryset

    def get_permissions(self):
        if self.action in ['list']:
            return [permissions.AllowAny()]
        elif self.action in ['update', 'partial_update', 'destroy']:
            return [perms.IsCourseTeacher()]
        return super().get_permissions()

    def perform_create(self, serializer):
        serializer.save(teacher=self.request.user)

    def perform_destroy(self, instance):
        instance.active = False
        instance.save()

    @action(methods=['get'], detail=True, url_path='lessons', permission_classes=[permissions.IsAuthenticated])
    def get_lessons(self, request, pk=None):
        lessons = self.get_object().lessons.order_by('created_at')
        paginated_lessons = self.paginate_queryset(lessons)
        serializer = LessonSerializer(paginated_lessons, many=True)
        return self.get_paginated_response(serializer.data)


class LessonViewSet(GenericViewSet, mixins.CreateModelMixin, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    queryset = Lesson.objects.order_by('-created_at')
    pagination_class = ItemPaginator
    permission_classes = [perms.IsTeacher]
    serializer_class = LessonSerializer
    http_method_names = ['get', 'post', 'patch', 'delete']

    def get_queryset(self):
        queryset = super().get_queryset()
        kw = self.request.query_params.get('kw')
        if kw:
            queryset = queryset.filter(title__icontains=kw)
        if self.action.__eq__('get_assignments'):
            queryset = queryset.prefetch_related('assignments')
        return queryset

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.IsAuthenticated()]
        return super().get_permissions()

    @swagger_auto_schema(
        method='get',
        operation_summary='Get assignments for a lesson',
        responses={200: 'AssignmentSerializer(many=True)'}
    )
    @action(methods=['get'], detail=True, url_path='assignments', permission_classes=[permissions.IsAuthenticated])
    def get_assignments(self, request, pk=None):
        assignments = self.get_object().assignments.order_by('created_at')
        paginated_assignments = self.paginate_queryset(assignments)
        serializer = AssignmentSerializer(paginated_assignments, many=True)
        return self.get_paginated_response(serializer.data)


class AssignmentViewSet(GenericViewSet, mixins.CreateModelMixin, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    queryset = Assignment.objects
    pagination_class = ItemPaginator
    permission_classes = [perms.IsTeacher]
    serializer_class = AssignmentSerializer
    http_method_names = ['get', 'post', 'patch', 'delete']


    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.IsAuthenticated()]
        return super().get_permissions()

    @swagger_auto_schema(
        method='get',
        operation_summary='Get submission for an assignment',
        responses={200: 'SubmissionSerializer()'}
    )
    @action(methods=['get'], detail=True, url_path='submissions', permission_classes=[perms.IsStudent])
    def get_submission(self, request, pk=None):
        assignment = self.get_object()
        submission = assignment.submissions.filter(student=request.user).first()
        if not submission:
            return Response({'detail': 'No submission found for this assignment'}, status=status.HTTP_404_NOT_FOUND)
        serializer = RoleMapper.get_submission_serializer(request.user.role)(submission)
        return Response(serializer.data, status=status.HTTP_200_OK)


class EnrollmentViewSet(GenericViewSet, mixins.CreateModelMixin, mixins.ListModelMixin):
    queryset = Enrollment.objects.select_related('course').order_by('-enrolled_at')
    pagination_class = ItemPaginator
    permission_classes = [perms.IsStudent]
    serializer_class = EnrollmentSerializer

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)

class SubmissionViewSet(GenericViewSet, mixins.CreateModelMixin, mixins.ListModelMixin, mixins.UpdateModelMixin, mixins.RetrieveModelMixin):
    queryset = Submission.objects.select_related('assignment', 'student','assignment__lesson__course').order_by('-submitted_at')
    pagination_class = ItemPaginator
    http_method_names = ['get', 'post', 'patch']
    serializer_class = StudentSubmissionSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        return RoleMapper.get_submission_queryset(self.request.user, queryset)

    def get_permissions(self):
        if self.action.__eq__('create'):
            return [perms.IsStudent()]
        elif self.action in ['update', 'partial_update']:
            return [perms.IsSubmissionOwner(), perms.IsTeacher()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)

    def get_serializer_class(self):
        if hasattr(self.request.user, 'role'):
            return RoleMapper.get_submission_serializer(self.request.user.role)
        return super().get_serializer_class()


class CertificateViewSet(GenericViewSet, mixins.ListModelMixin, mixins.RetrieveModelMixin):
    queryset = Certificate.objects.select_related('enrollment__student', 'enrollment__course').order_by('-issued_at')
    pagination_class = ItemPaginator
    permission_classes = [perms.IsStudent]
    serializer_class = CertificateSerializer

    def get_queryset(self):
        return self.queryset.filter(enrollment__student = self.request.user )


