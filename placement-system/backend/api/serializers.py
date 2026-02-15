from rest_framework import serializers
from .models import User, StudentProfile, CompanyDrive, Application

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'department']

class StudentProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = StudentProfile
        fields = ['id', 'user', 'profile_photo', 'resume', 'resume_filename', 'cgpa', 'skills', 'created_at']

class CompanyDriveSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.username', read_only=True)
    
    class Meta:
        model = CompanyDrive
        fields = '__all__'
        read_only_fields = ['created_at']

class ApplicationSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.user.username', read_only=True)
    drive_details = CompanyDriveSerializer(source='drive', read_only=True)
    
    class Meta:
        model = Application
        fields = '__all__'