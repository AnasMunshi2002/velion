from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from . import views

router = DefaultRouter()
router.register(r'users', views.PersonViewSet)
router.register(r'documents', views.DocumentViewSet)
router.register(r'projects', views.ProjectViewSet)
router.register(r'workspaces', views.WorkspaceViewSet)
router.register(r'analytics', views.AnalyticsViewSet, basename='analytics')

urlpatterns = [
    path('', include(router.urls)),
    
    # Authentication
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Search endpoint
    path('search/', views.DocumentViewSet.as_view({'post': 'search'}), name='document-search'),
    
    # Graph endpoint
    path('graph/', views.GraphView.as_view(), name='graph'),
]