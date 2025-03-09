from rest_framework import serializers
from .models import *

class TaskEventSerializer(serializers.ModelSerializer):
    title = serializers.CharField(source='name')
    start = serializers.DateTimeField(source='start_datetime')
    end = serializers.DateTimeField(source='end_datetime')
    class Meta:
        model = TasksEvents
        fields = ('id', 'title', 'start', 'end')