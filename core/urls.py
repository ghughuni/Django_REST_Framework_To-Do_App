from django.urls import path
from .views import (
    tasks_list,
)

urlpatterns = [
	path('', tasks_list, name="tasks_list"),
]
