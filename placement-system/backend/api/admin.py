from django.contrib import admin
from .models import User, StudentProfile, CompanyDrive, Application

admin.site.register(User)
admin.site.register(StudentProfile)
admin.site.register(CompanyDrive)
admin.site.register(Application)