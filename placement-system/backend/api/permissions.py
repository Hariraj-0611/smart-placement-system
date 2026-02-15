from rest_framework import permissions

class IsStudent(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'student'

class IsOfficer(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'officer'

class IsOwnerOrOfficer(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.role == 'officer':
            return True
        return obj.user == request.user