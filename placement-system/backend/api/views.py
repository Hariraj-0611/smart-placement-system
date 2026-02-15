from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status, viewsets
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, StudentProfile, CompanyDrive, Application
from .serializers import *

# Authentication Views
@api_view(['POST'])
@permission_classes([AllowAny])
def register_student(request):
    try:
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        department = request.data.get('department')
        cgpa = request.data.get('cgpa')
        skills = request.data.get('skills', [])
        
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=400)
        
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            role='student',
            department=department
        )
        
        StudentProfile.objects.create(
            user=user,
            cgpa=cgpa,
            skills=skills
        )
        
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role
            }
        }, status=201)
    except Exception as e:
        return Response({'error': str(e)}, status=400)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(username=username, password=password)
    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role
            }
        })
    return Response({'error': 'Invalid credentials'}, status=401)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    user = request.user
    if user.role == 'student':
        try:
            profile = StudentProfile.objects.get(user=user)
            return Response({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role,
                'department': user.department,
                'profile_photo': profile.profile_photo.url if profile.profile_photo else None,
                'resume': profile.resume.url if profile.resume else None,
                'cgpa': profile.cgpa,
                'skills': profile.skills
            })
        except StudentProfile.DoesNotExist:
            return Response({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role,
                'department': user.department
            })
    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'role': user.role
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def student_dashboard(request):
    if request.user.role != 'student':
        return Response({'error': 'Unauthorized'}, status=403)
    
    try:
        profile = StudentProfile.objects.get(user=request.user)
        applications = Application.objects.filter(student=profile)
        
        return Response({
            'total_drives_available': CompanyDrive.objects.filter(status='active').count(),
            'applied_drives_count': applications.count(),
            'selection_count': applications.filter(status='selected').count(),
            'recent_applications': ApplicationSerializer(applications.order_by('-applied_at')[:5], many=True).data,
            'upcoming_drives': CompanyDriveSerializer(CompanyDrive.objects.filter(status='active').order_by('deadline')[:5], many=True).data
        })
    except Exception as e:
        return Response({'error': str(e)}, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def officer_dashboard(request):
    if request.user.role != 'officer':
        return Response({'error': 'Unauthorized'}, status=403)
    
    return Response({
        'total_students': StudentProfile.objects.count(),
        'total_drives': CompanyDrive.objects.count(),
        'total_applications': Application.objects.count(),
        'active_drives': CompanyDrive.objects.filter(status='active').count(),
        'selected_count': Application.objects.filter(status='selected').count()
    })

# ViewSets
class StudentProfileViewSet(viewsets.ModelViewSet):
    queryset = StudentProfile.objects.all()
    serializer_class = StudentProfileSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.role == 'officer':
            return StudentProfile.objects.all()
        return StudentProfile.objects.filter(user=self.request.user)

class CompanyDriveViewSet(viewsets.ModelViewSet):
    queryset = CompanyDrive.objects.all().order_by('-created_at')
    serializer_class = CompanyDriveSerializer
    permission_classes = [IsAuthenticated]

class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all().order_by('-applied_at')
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]