from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'students', views.StudentProfileViewSet)
router.register(r'drives', views.CompanyDriveViewSet)
router.register(r'applications', views.ApplicationViewSet)

urlpatterns = [
    path('register/', views.register_student, name='register'),
    path('login/', views.login_user, name='login'),
    path('me/', views.get_current_user, name='current-user'),
    path('dashboard/student/', views.student_dashboard, name='student-dashboard'),
    path('dashboard/officer/', views.officer_dashboard, name='officer-dashboard'),
    path('', include(router.urls)),
]