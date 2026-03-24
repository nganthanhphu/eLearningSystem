from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from elearning.models import User, Course, Lesson, Assignment, Enrollment, Submission


class UserSerializer(serializers.ModelSerializer):
    old_password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['username', 'password', 'first_name', 'last_name', 'email', 'role', 'avatar', 'dob', 'old_password']
        extra_kwargs = {
            'password': {
                'write_only': True
            },
            'role': {
                'read_only': True
            }
        }

    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(user.password)
        user.save()
        return user

    def update(self, instance, validated_data):
        old_password = validated_data.pop('old_password', None)
        keys = set(validated_data.keys())
        if keys - {'first_name', 'last_name', 'email', 'avatar', 'password', 'dob'}:
            raise ValidationError('Invalid fields for update')
        if 'password' in validated_data:
            if not old_password or not instance.check_password(old_password):
                raise ValidationError('Incorrect old password')
            instance.set_password(validated_data.pop('password'))
        return super().update(instance, validated_data)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if instance.avatar:
            data['avatar'] = instance.avatar.url
        return data


class CourseSerializer(serializers.ModelSerializer):
    teacher = UserSerializer(read_only=True)

    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'teacher', 'created_at']
        read_only_fields = ['id', 'teacher', 'created_at']


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'title', 'content', 'course', 'created_at', 'video_url']
        read_only_fields = ['id', 'created_at']
        extra_kwargs = {
            'course': {
                'write_only': True
            }
        }


class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = ['id', 'title', 'content', 'lesson']
        read_only_fields = ['id']
        extra_kwargs = {
            'lesson': {
                'write_only': True
            }
        }


class EnrollmentSerializer(serializers.ModelSerializer):
    course = CourseSerializer(read_only=True)

    class Meta:
        model = Enrollment
        fields = ['id', 'student', 'course', 'enrolled_at', 'progress']
        read_only_fields = ['id', 'student', 'enrolled_at']


class StudentSubmissionSerializer(serializers.ModelSerializer):
    assignment = AssignmentSerializer(read_only=True)

    class Meta:
        model = Submission
        fields = ['id', 'assignment', 'student', 'content', 'submitted_at', 'grade', 'comment']
        read_only_fields = ['id', 'student', 'submitted_at']

    def update(self, instance, validated_data):
        keys = set(validated_data.keys())
        if keys - {'content'}:
            raise ValidationError('Invalid fields for update')
        return super().update(instance, validated_data)

class TeacherSubmissionSerializer(StudentSubmissionSerializer):
    student = UserSerializer(read_only=True)

    def update(self, instance, validated_data):
        keys = set(validated_data.keys())
        if keys - {'grade', 'comment'}:
            raise ValidationError('Invalid fields for update')
        return super().update(instance, validated_data)


class CertificateSerializer(serializers.Serializer):
    student = serializers.ReadOnlyField(source='enrollment.student.get_full_name')
    course = serializers.ReadOnlyField(source='enrollment.course.title')

    class Meta:
        fields = ['id', 'enrollment', 'issued_at', 'student', 'course']
        read_only_fields = ['id', 'enrollment', 'issued_at', 'student', 'course']