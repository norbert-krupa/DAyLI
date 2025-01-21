from rest_framework import serializers
from .models import *

class TaskEventSerializer(serializers.ModelSerializer):
    title = serializers.CharField(source='name')
    start = serializers.DateField(source='start_date')
    end = serializers.DateField(source='end_date')
    class Meta:
        model = TasksEvents
        fields = ('id', 'title', 'start', 'end')