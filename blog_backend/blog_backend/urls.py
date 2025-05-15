from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from blog.views import BlogViewSet, RegisterView
from rest_framework.routers import DefaultRouter

# Initialize the router
router = DefaultRouter()
router.register('blogs', BlogViewSet, basename='blogs')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/register/', RegisterView.as_view(), name='register'), 
    path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'), 
    path('api/', include(router.urls)), 
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
