from celery import shared_task
from django.core.mail import send_mail

from elearning import models

@shared_task
def send_welcome_email(user_id):
    user = models.User.objects.get(id=user_id)
    send_mail(
        'Chào mừng đến với hệ thống học trực tuyến E-Learning',
        f'Chào {user.get_full_name()},\n\nChào mừng bạn đến với nền tảng E-Learning của chúng tôi! Hãy khám phá các khóa học và bắt đầu học ngay hôm nay!\n\nTrân trọng,\nĐội ngũ E-Learning System',
        'nhocjoon123@gmail.com',
        [user.email],
        fail_silently=True,
    )

@shared_task
def send_certificate_email(enrollment_id):
    enrollment = models.Enrollment.objects.select_related('student', 'course').get(id=enrollment_id)
    send_mail(
        'Chúc mừng bạn đã hoàn thành khóa học!',
        f'Chào {enrollment.student.get_full_name()},\n\nChúc mừng bạn đã hoàn thành khóa học "{enrollment.course.title}"! Bạn có thể truy cập vào hệ thống để xem chứng chỉ.\n\nTrân trọng,\nĐội ngũ E-Learning System',
        'nhocjoon123@gmail.com',
        [enrollment.student.email],
        fail_silently=True)