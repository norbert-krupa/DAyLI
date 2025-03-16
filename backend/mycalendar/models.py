import uuid
from django.db import models
from django.utils.timezone import now

class TasksEvents(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey('users.CustomUser', on_delete=models.CASCADE, related_name='tasks_events')
    name = models.CharField(max_length=200)
    start_datetime = models.DateTimeField(default=now)
    end_datetime = models.DateTimeField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    group = models.ForeignKey('TaskEventGroup', on_delete=models.SET_NULL, related_name='events', blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    
class TaskEventGroup(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey('users.CustomUser', on_delete=models.CASCADE, related_name='task_event_groups')
    name = models.CharField(max_length=200)
    color = models.CharField(max_length=100)

    def __str__(self):
        return self.name