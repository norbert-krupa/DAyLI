from rest_framework import serializers
from .models import *

class TaskEventSerializer(serializers.ModelSerializer):
    title = serializers.CharField(source='name')
    start = serializers.DateTimeField(source='start_datetime')
    end = serializers.DateTimeField(source='end_datetime')
    class Meta:
        model = TasksEvents
        fields = ('id', 'title', 'owner', 'start', 'end', 'description', 'group')

class TaskEventGroupSerializer(serializers.ModelSerializer):
    group_color = serializers.CharField(source='color')

    class Meta:
        model = TaskEventGroup
        fields = ('id', 'name', 'description', 'owner', 'group_color')