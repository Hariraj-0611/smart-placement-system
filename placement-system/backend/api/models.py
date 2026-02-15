from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import FileExtensionValidator, MinValueValidator, MaxValueValidator
import os
import json

def profile_photo_path(instance, filename):
    return f'profile_photos/user_{instance.user.id}/{filename}'

def resume_path(instance, filename):
    return f'resumes/user_{instance.user.id}/{filename}'

class User(AbstractUser):
    ROLE_CHOICES = (
        ('student', 'Student'),
        ('officer', 'Placement Officer'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')
    department = models.CharField(max_length=100, blank=True, null=True)
    
    def __str__(self):
        return f"{self.username} - {self.role}"

class StudentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student_profile')
    profile_photo = models.ImageField(
        upload_to=profile_photo_path,
        validators=[FileExtensionValidator(['jpg', 'jpeg', 'png'])],
        blank=True, null=True
    )
    resume = models.FileField(
        upload_to=resume_path,
        validators=[FileExtensionValidator(['pdf', 'doc', 'docx'])],
        blank=True, null=True
    )
    cgpa = models.FloatField(
        validators=[MinValueValidator(0.0), MaxValueValidator(10.0)],
        null=True, blank=True
    )
    skills = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"

    @property
    def resume_filename(self):
        if self.resume:
            return os.path.basename(self.resume.name)
        return None

class CompanyDrive(models.Model):
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('closed', 'Closed'),
        ('completed', 'Completed'),
    )
    
    company_name = models.CharField(max_length=200)
    role = models.CharField(max_length=200)
    description = models.TextField()
    eligibility_criteria = models.TextField()
    minimum_cgpa = models.FloatField(validators=[MinValueValidator(0.0), MaxValueValidator(10.0)])
    required_skills = models.JSONField(default=list)
    deadline = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, limit_choices_to={'role': 'officer'})
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.company_name} - {self.role}"

class Application(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('shortlisted', 'Shortlisted'),
        ('selected', 'Selected'),
        ('rejected', 'Rejected'),
    )
    
    student = models.ForeignKey(StudentProfile, on_delete=models.CASCADE, related_name='applications')
    drive = models.ForeignKey(CompanyDrive, on_delete=models.CASCADE, related_name='applications')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('student', 'drive')
    
    def __str__(self):
        return f"{self.student.user.username} - {self.drive.company_name}"