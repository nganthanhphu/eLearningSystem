from django.contrib import admin
from django.contrib.admin import AdminSite
from elearning import models

@admin.register(models.User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'role', 'first_name', 'last_name', 'gender', 'dob')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    list_filter = ('role',)


@admin.register(models.Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'teacher', 'created_at', 'active')
    search_fields = ('title',)
    list_filter = ('active', 'created_at')


@admin.register(models.Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'created_at')
    search_fields = ('title',)
    list_filter = ('created_at',)


@admin.register(models.Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ('title', 'lesson')
    search_fields = ('title',)
    list_filter = ('lesson',)


@admin.register(models.Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('student', 'course', 'enrolled_at', 'progress')
    search_fields = ('student__username', 'course__title')
    list_filter = ('enrolled_at',)


@admin.register(models.Submission)
class SubmissionAdmin(admin.ModelAdmin):
    list_display = ('assignment', 'student', 'submitted_at', 'grade')
    search_fields = ('assignment__title', 'student__username')
    list_filter = ('submitted_at',)


@admin.register(models.Certificate)
class CertificateAdmin(admin.ModelAdmin):
    list_display = ('enrollment__student', 'enrollment__course', 'issued_at')
    search_fields = ('enrollment__student__username', 'enrollment__course__title')
    list_filter = ('issued_at',)


class MyAdminSite(AdminSite):
    site_header = 'E-Learning Admin'
    site_title = 'E-Learning Admin Portal'
    index_title = 'Welcome to E-Learning Admin'

admin_site = MyAdminSite(name='E-Learning Admin')
admin_site.register(models.User, UserAdmin)
admin_site.register(models.Course, CourseAdmin)
admin_site.register(models.Lesson, LessonAdmin)
admin_site.register(models.Assignment, AssignmentAdmin)
admin_site.register(models.Enrollment, EnrollmentAdmin)
admin_site.register(models.Submission, SubmissionAdmin)
admin_site.register(models.Certificate, CertificateAdmin)