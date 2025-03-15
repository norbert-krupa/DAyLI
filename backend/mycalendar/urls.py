from django.contrib import admin
from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()
router.register('tasksevents', TaskEventViewSet, basename='tasksevents')
router.register('taskeventgroups', TaskEventGroupViewSet, basename='taskeventgroups')
urlpatterns = router.urls