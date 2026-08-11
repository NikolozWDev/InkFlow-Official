from django.contrib import admin
from django.urls import path, include
from api.views import EmailTokenObtainPairView, RegisterView, CurrentUserView, DeleteAccountView, health_check
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user/register/', RegisterView.as_view(), name="register"),
    path('api/user/delete/', DeleteAccountView.as_view(), name="delete_account"),
    path("api/token/", EmailTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path('api/token/refresh/', TokenRefreshView.as_view(), name="refresh"),
    path('api/user/me/', CurrentUserView.as_view(), name="user_view"),
    path('api-auth/', include("rest_framework.urls")),
    path('api/', include("api.urls")),
    path('api/health/', health_check, name='health_check'),
]