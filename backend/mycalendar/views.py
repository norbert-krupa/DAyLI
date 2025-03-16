from django.shortcuts import get_object_or_404
from rest_framework import viewsets, permissions
from rest_framework.response import Response

from users.models import CustomUser
from .serializers import *
from .models import *


class TaskEventViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = TasksEvents.objects.all()
    serializer_class = TaskEventSerializer

    def create(self, request):
        owner_id = request.data.get('owner')
        if not owner_id:
            return Response({'error': 'Owner is required'}, status=400)
        try:
            owner = CustomUser.objects.get(id=owner_id)
        except CustomUser.DoesNotExist:
            return Response({'error': 'Owner not found'}, status=404)
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=owner)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    

    def list(self, request):
        owner_id = request.query_params.get('owner')
        if not owner_id:
            queryset = TasksEvents.objects.all()
        else:
            try:
                owner = CustomUser.objects.get(id=owner_id)
            except CustomUser.DoesNotExist:
                return Response({'error': 'Owner not found'}, status=404)
            queryset = TasksEvents.objects.filter(owner=owner)
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)


    def retrieve(self, request, pk=None):
        owner_id = request.query_params.get('owner')
        if not owner_id:
            return Response({'error': 'Owner is required'}, status=400)
        try:
            owner = CustomUser.objects.get(id=owner_id)
        except CustomUser.DoesNotExist:
            return Response({'error': 'Owner not found'}, status=404)
        try:
            task_event = TasksEvents.objects.get(pk=pk)
        except TasksEvents.DoesNotExist:
            return Response({'error': 'TaskEvent not found'}, status=404)
        if task_event.owner != owner:
            return Response({'error': 'Unauthorized'}, status=401)
        serializer = self.serializer_class(task_event)
        return Response(serializer.data)


    def destroy(self, request, pk=None):
        owner_id = request.query_params.get('owner')
        if not owner_id:
            return Response({'error': 'Owner is required'}, status=400)
        try:
            owner = CustomUser.objects.get(id=owner_id)
        except CustomUser.DoesNotExist:
            return Response({'error': 'Owner not found'}, status=404)
        try:
            task_event = TasksEvents.objects.get(pk=pk)
        except TasksEvents.DoesNotExist:
            return Response({'error': 'TaskEvent not found'}, status=404)
        if task_event.owner != owner:
            return Response({'error': 'Unauthorized'}, status=401)
        task_event.delete()
        return Response({'message': 'TaskEvent deleted successfully'}, status=204)


    def update(self, request, pk=None):
        owner_id = request.query_params.get('owner')
        if not owner_id:
            return Response({'error': 'Owner is required'}, status=400)
        try:
            owner = CustomUser.objects.get(id=owner_id)
        except CustomUser.DoesNotExist:
            return Response({'error': 'Owner not found'}, status=404)
        try:
            task_event = self.queryset.get(pk=pk)
        except TasksEvents.DoesNotExist:
            return Response({'error': 'TaskEvent not found'}, status=404)
        if task_event.owner != owner:
            return Response({'error': 'Unauthorized'}, status=401)
        serializer = self.serializer_class(task_event, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)


class TaskEventGroupViewSet(viewsets.ViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = TaskEventGroup.objects.all()
    serializer_class = TaskEventGroupSerializer

    
    def create(self, request):
        owner_id = request.data.get('owner')

        if not owner_id:
            return Response({'error': 'Owner is required'}, status=400)
        
        try:
            owner = CustomUser.objects.get(id=owner_id)
        except CustomUser.DoesNotExist:
            return Response({'error': 'Owner not found'}, status=404)
        
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=owner)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def list(self, request):
        owner_id = request.query_params.get('owner')
        if not owner_id:
            queryset = TaskEventGroup.objects.all()
        else:
            try:
                owner = CustomUser.objects.get(id=owner_id)
            except CustomUser.DoesNotExist:
                return Response({'error': 'Owner not found'}, status=404)
            queryset = TaskEventGroup.objects.filter(owner=owner)
        event_ids = []
        for group in queryset:
            event_ids.append(list(group.events.values_list('id', flat=True)))
        serializer = self.serializer_class(queryset, many=True)
        group_data = serializer.data
        for i, group in enumerate(group_data):
            group['events'] = event_ids[i]
        return Response(group_data, status=200)
    

    def retrieve(self, request, pk=None):
        owner_id = request.query_params.get('owner')
        if not owner_id:
            return Response({'error': 'Owner is required'}, status=400)
        try:
            owner = CustomUser.objects.get(id=owner_id)
        except CustomUser.DoesNotExist:
            return Response({'error': 'Owner not found'}, status=404)
        try:
            task_event_group = TaskEventGroup.objects.get(pk=pk)
        except TaskEventGroup.DoesNotExist:
            return Response({'error': 'TaskEventGroup not found'}, status=404)
        if task_event_group.owner != owner:
            return Response({'error': 'Unauthorized'}, status=401)
        event_ids = list(task_event_group.events.values_list('id', flat=True))
        serializer = self.serializer_class(task_event_group)
        group_data = serializer.data
        group_data['events'] = event_ids
        return Response(group_data, status=200)


    def destroy(self, request, pk=None):
        owner_id = request.query_params.get('owner')
        if not owner_id:
            return Response({'error': 'Owner is required'}, status=400)
        try:
            owner = CustomUser.objects.get(id=owner_id)
        except CustomUser.DoesNotExist:
            return Response({'error': 'Owner not found'}, status=404)
        try:
            task_event_group = TaskEventGroup.objects.get(pk=pk)
        except TaskEventGroup.DoesNotExist:
            return Response({'error': 'TaskEventGroup not found'}, status=404)
        if task_event_group.owner != owner:
            return Response({'error': 'Unauthorized'}, status=401)
        task_event_group.delete()
        return Response({'message': 'TaskEventGroup deleted successfully'}, status=204)


    def update(self, request, pk=None):
        owner_id = request.query_params.get('owner')
        if not owner_id:
            return Response({'error': 'Owner is required'}, status=400)
        try:
            owner = CustomUser.objects.get(id=owner_id)
        except CustomUser.DoesNotExist:
            return Response({'error': 'Owner not found'}, status=404)
        try:
            task_event_group = self.queryset.get(pk=pk)
        except TaskEventGroup.DoesNotExist:
            return Response({'error': 'TaskEventGroup not found'}, status=404)
        if task_event_group.owner != owner:
            return Response({'error': 'Unauthorized'}, status=401)
        serializer = self.serializer_class(task_event_group, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            event_ids = list(task_event_group.events.values_list('id', flat=True))
            group_data = serializer.data
            group_data['events'] = event_ids
            return Response(group_data, status=200)
