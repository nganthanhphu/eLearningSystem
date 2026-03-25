from django.apps import AppConfig


class ElearningConfig(AppConfig):
    name = 'elearning'

    def ready(self):
        from . import signals
