from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.validators import UniqueTogetherValidator

from elearning.models import User, Course, Lesson, Assignment, Enrollment, Submission, Certificate


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
            if hasattr(instance.avatar, "url"):
                data['avatar'] = instance.avatar.url
            else:
                data['avatar'] = instance.avatar
        return data

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'teacher', 'created_at']
        read_only_fields = ['id', 'teacher', 'created_at']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['teacher'] = UserSerializer(instance.teacher).data if instance.teacher else None
        return data


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
    student = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Enrollment
        fields = ['id', 'student', 'course', 'enrolled_at', 'progress']
        read_only_fields = ['id', 'student', 'enrolled_at']
        validators = [
            UniqueTogetherValidator(
                queryset=Enrollment.objects.all(),
                fields=['student', 'course'],
                message="You are already enrolled in this course."
            )
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['course'] = CourseSerializer(instance.course).data if instance.course else None
        return data


class BaseSubmissionSerializer(serializers.ModelSerializer):
    student = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Submission
        fields = ['id', 'assignment', 'student', 'content', 'submitted_at', 'grade', 'comment']
        read_only_fields = ['id', 'submitted_at', 'student']
        validators = [
            UniqueTogetherValidator(
                queryset=Submission.objects.all(),
                fields=['assignment', 'student'],
                message="You have already submitted for this assignment."
            )
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['assignment'] = AssignmentSerializer(instance.assignment).data if instance.assignment else None
        data['student'] = UserSerializer(instance.student).data if instance.student else None
        return data


class StudentSubmissionSerializer(BaseSubmissionSerializer):
    class Meta(BaseSubmissionSerializer.Meta):
        read_only_fields = BaseSubmissionSerializer.Meta.read_only_fields + ['grade', 'comment']

    def update(self, instance, validated_data):
        keys = set(validated_data.keys())
        if keys - {'content'}:
            raise ValidationError('Invalid fields for update')
        validated_data['grade'] = None
        validated_data['comment'] = None
        return super().update(instance, validated_data)


class TeacherSubmissionSerializer(BaseSubmissionSerializer):
    class Meta(BaseSubmissionSerializer.Meta):
        read_only_fields = BaseSubmissionSerializer.Meta.read_only_fields + ['content', 'assignment']

    def update(self, instance, validated_data):
        keys = set(validated_data.keys())
        if keys - {'grade', 'comment'}:
            raise ValidationError('Invalid fields for update')
        return super().update(instance, validated_data)


class CertificateSerializer(serializers.ModelSerializer):
    first_name = serializers.ReadOnlyField(source='enrollment.student.first_name')
    last_name = serializers.ReadOnlyField(source='enrollment.student.last_name')
    course = serializers.ReadOnlyField(source='enrollment.course.title')

    class Meta:
        model = Certificate
        fields = ['id', 'enrollment', 'issued_at', 'first_name','last_name', 'course']
        read_only_fields = ['id', 'enrollment', 'issued_at', 'first_name','last_name', 'course']
