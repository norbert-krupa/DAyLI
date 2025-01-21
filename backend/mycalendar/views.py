from rest_framework import viewsets, permissions
from rest_framework.response import Response
from .serializers import *
from .models import *


class TaskEventViewSet(viewsets.ViewSet):
    permissions_classes = [permissions.AllowAny]
    queryset = TasksEvents.objects.all()
    serializer_class = TaskEventSerializer


    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=400)

    def list(self, request):
        queryset =  TasksEvents.objects.all()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)


    def retrieve(self, request, pk=None):
        queryset = self.queryset.get(pk=pk)
        serializer = self.serializer_class(queryset)
        return Response(serializer.data)
    
    def destroy(self, request, pk=None):
        try:
            task_event = self.queryset.get(pk=pk)
            task_event.delete()
            return Response({'message': 'Task event deleted successfully'}, status=204)
        except TasksEvents.DoesNotExist:
            return Response({'error': 'Task event not found'}, status=404)
        
    def update(self, request, pk=None):
        try:
            task_event = self.queryset.get(pk=pk)
        except TasksEvents.DoesNotExist:
            return Response({'error': 'TaskEvent not found'}, status=404)
        serializer = self.serializer_class(task_event, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        else:
            return Response(serializer.errors, status=400)
