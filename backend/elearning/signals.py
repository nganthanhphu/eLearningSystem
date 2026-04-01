from django.db import transaction
from django.db.models.signals import post_save
from django.dispatch import receiver

from elearning.models import User, Submission, Enrollment, Assignment,Certificate
from elearning.tasks import send_welcome_email, send_certificate_email


@receiver(post_save, sender=User)
def trigger_welcome_email(sender, instance, created, **kwargs):
    if created:
        transaction.on_commit(
            lambda: send_welcome_email.delay(instance.pk)
        )


@receiver(post_save, sender=Submission)
def update_enrollment_progress(sender, instance, created, **kwargs):
    if instance.grade is None or instance.grade <= 8:
        return

    course = instance.assignment.lesson.course
    enrollment = Enrollment.objects.get(
        student=instance.student,
        course=course
    )

    total_assignments = Assignment.objects.filter(
        lesson__course=course
    ).count()

    if total_assignments == 0:
        enrollment.progress = 0.0
    else:
        completed_assignments = Submission.objects.filter(
            student=instance.student,
            assignment__lesson__course=course,
            grade__gt=8
        ).values('assignment_id').distinct().count()

        progress = (completed_assignments / total_assignments) * 100
        enrollment.progress = progress

    enrollment.save(update_fields=['progress'])

@receiver(post_save, sender=Enrollment)
def create_certificate(sender, instance, created, **kwargs):
    if not created and instance.progress >= 90:
        Certificate.objects.get_or_create(enrollment=instance)

        transaction.on_commit(
            lambda: send_certificate_email.delay(instance.pk)
        )