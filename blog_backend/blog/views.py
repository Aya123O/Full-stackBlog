from rest_framework import viewsets, permissions
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Blog
from .serializers import BlogSerializer, RegisterSerializer
from rest_framework.exceptions import PermissionDenied

class BlogViewSet(viewsets.ModelViewSet):
    queryset = Blog.objects.all().order_by('-id')
    serializer_class = BlogSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated()]
        return [AllowAny()]  

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def get_queryset(self):
        if self.request.query_params.get('mine') and self.request.user.is_authenticated:
            return Blog.objects.filter(author=self.request.user).order_by('-id')
        return Blog.objects.all().order_by('-id')

    def perform_update(self, serializer):
        if self.request.user != serializer.instance.author:
            raise PermissionDenied("You can only edit your own blogs.")
        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user != instance.author:
            raise PermissionDenied("You can only delete your own blogs.")
        instance.delete()


from rest_framework import generics

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
