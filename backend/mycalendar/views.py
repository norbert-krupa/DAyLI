from django.shortcuts import get_object_or_404
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from .serializers import *
from .models import *


class TaskEventViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = TasksEvents.objects.all()
    serializer_class = TaskEventSerializer


    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=400)

    def list(self, request):
        if request.user.is_superuser:
            queryset = TasksEvents.objects.all()
        else:
            queryset = TasksEvents.objects.filter(owner=request.user)
        serializer = TaskEventSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        if request.user.is_superuser:
            task_event = get_object_or_404(TasksEvents, pk=pk)
        else:
            task_event = get_object_or_404(TasksEvents, pk=pk, owner=request.user)
        serializer = TaskEventSerializer(task_event)
        return Response(serializer.data)
    
    def destroy(self, request, pk=None):
        try:
            task_event = self.queryset.get(pk=pk, owner=request.user)
            task_event.delete()
            return Response({'message': 'TaskEvent deleted successfully'}, status=204)
        except TasksEvents.DoesNotExist:
            return Response({'error': 'TaskEvent not found'}, status=404)
        
    def update(self, request, pk=None):
        try:
            task_event = self.queryset.get(pk=pk, owner=request.user)
        except TasksEvents.DoesNotExist:
            return Response({'error': 'TaskEvent not found'}, status=404)
        serializer = self.serializer_class(task_event, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        else:
            return Response(serializer.errors, status=400)
        

class TaskEventGroupViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = TaskEventGroup.objects.all()
    serializer_class = TaskEventGroupSerializer

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=400)

    def list(self, request):
        if request.user.is_superuser:
            queryset = TaskEventGroup.objects.all()
        else:
            queryset = TaskEventGroup.objects.filter(owner=request.user)
        serializer = TaskEventGroupSerializer(queryset, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        if request.user.is_superuser:
            task_event_group = get_object_or_404(TaskEventGroup, pk=pk)
        else:
            task_event_group = get_object_or_404(TaskEventGroup, pk=pk, owner=request.user)
        serializer = TaskEventGroupSerializer(task_event_group)
        return Response(serializer.data)

    def destroy(self, request, pk=None):
        try:
            task_event_group = self.queryset.get(pk=pk, owner=request.user)
            task_event_group.delete()
            return Response({'message': 'TaskEventGroup deleted successfully'}, status=204)
        except TaskEventGroup.DoesNotExist:
            return Response({'error': 'TaskEventGroup not found'}, status=404)

    def update(self, request, pk=None):
        try:
            task_event_group = self.queryset.get(pk=pk, owner=request.user)
        except TaskEventGroup.DoesNotExist:
            return Response({'error': 'TaskEventGroup not found'}, status=404)
        serializer = self.serializer_class(task_event_group, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        else:
            return Response(serializer.errors, status=400)
