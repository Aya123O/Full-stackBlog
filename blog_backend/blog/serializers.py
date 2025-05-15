from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Blog

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class BlogSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Blog
        fields = ['id', 'name', 'title', 'body', 'image_url','author', 'created_at', 'updated_at']
