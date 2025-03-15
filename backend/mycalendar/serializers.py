from rest_framework import serializers
from .models import *

class TaskEventSerializer(serializers.ModelSerializer):
    title = serializers.CharField(source='name')
    start = serializers.DateTimeField(source='start_datetime')
    end = serializers.DateTimeField(source='end_datetime')
    class Meta:
        model = TasksEvents
        fields = ('id', 'title', 'start', 'end')

class TaskEventGroupSerializer(serializers.ModelSerializer):
    group_color = serializers.CharField(source='color')
    events = serializers.PrimaryKeyRelatedField(source='tasks_events', queryset=TasksEvents.objects.all(), many=True)

    class Meta:
        model = TaskEventGroup
        fields = ('id', 'name', 'group_color', 'events')