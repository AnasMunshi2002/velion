from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.parsers import MultiPartParser, JSONParser
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Count, Avg, F, ExpressionWrapper, FloatField
from django.db.models.functions import TruncDate
from django.utils import timezone
from datetime import timedelta
import logging

from .models import (
    Person, Document, KnowledgeComponent, Project, 
    Workspace, WorkspaceMembership, BlockchainTransaction,
    AnalyticsComponent, ValidationActivity, ActivityLog
)
from .serializers import (
    PersonSerializer, DocumentSerializer, KnowledgeComponentSerializer,
    ProjectSerializer, WorkspaceSerializer, WorkspaceMembershipSerializer,
    BlockchainTransactionSerializer, AnalyticsComponentSerializer,
    ValidationActivitySerializer, ActivityLogSerializer,
    DocumentSearchSerializer, GraphQuerySerializer
)
from .permissions import (
    IsOwnerOrReadOnly, IsAdminOrKnowledgeChampion,
    IsWorkspaceMember, IsWorkspaceOwnerOrAdmin
)

logger = logging.getLogger(__name__)

class PersonViewSet(viewsets.ModelViewSet):
    queryset = Person.objects.filter(is_active=True)
    serializer_class = PersonSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['email', 'first_name', 'last_name', 'employee_id', 'department']
    ordering_fields = ['last_activity', 'date_joined', 'profile_completion']
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('q', '')
        if not query:
            return Response([])
        
        users = Person.objects.filter(
            Q(email__icontains=query) |
            Q(first_name__icontains=query) |
            Q(last_name__icontains=query) |
            Q(employee_id__icontains=query)
        ).filter(is_active=True)[:10]
        
        serializer = self.get_serializer(users, many=True)
        return Response(serializer.data)

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'document_type', 'uploader']
    search_fields = ['title', 'description', 'tags']
    ordering_fields = ['created_at', 'updated_at', 'quality_score', 'view_count']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by workspace if specified
        workspace_id = self.request.query_params.get('workspace')
        if workspace_id:
            workspace = Workspace.objects.filter(id=workspace_id).first()
            if workspace:
                queryset = queryset.filter(workspace=workspace)
        
        # Filter by project if specified
        project_id = self.request.query_params.get('project')
        if project_id:
            queryset = queryset.filter(projects__id=project_id)
        
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(uploader=self.request.user)
    
    @action(detail=True, methods=['post'])
    def validate(self, request, pk=None):
        document = self.get_object()
        action = request.data.get('action')
        feedback = request.data.get('feedback', '')
        
        if action not in ['APPROVE', 'REJECT', 'REQUEST_CHANGES']:
            return Response(
                {'error': 'Invalid action'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create validation activity
        ValidationActivity.objects.create(
            document=document,
            validator=request.user,
            action=action,
            feedback=feedback,
            previous_status=document.status,
            new_status=self._get_new_status(action, document)
        )
        
        # Update document status
        document.status = self._get_new_status(action, document)
        document.save()
        
        # Update knowledge component if exists
        if hasattr(document, 'knowledge_component'):
            knowledge_component = document.knowledge_component
            if action == 'APPROVE':
                knowledge_component.validate(request.user, feedback)
        
        serializer = self.get_serializer(document)
        return Response(serializer.data)
    
    def _get_new_status(self, action, document):
        if action == 'APPROVE':
            return 'PUBLISHED'
        elif action == 'REJECT':
            return 'REJECTED'
        elif action == 'REQUEST_CHANGES':
            return 'DRAFT'
        return document.status
    
    @action(detail=False, methods=['get'])
    def pending_validations(self, request):
        if request.user.role not in ['ADMIN', 'KNOWLEDGE_CHAMPION']:
            return Response(
                {'error': 'Permission denied'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        documents = Document.objects.filter(
            status__in=['PENDING_REVIEW', 'UNDER_REVIEW']
        ).order_by('-created_at')
        
        page = self.paginate_queryset(documents)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(documents, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def recent(self, request):
        limit = min(int(request.query_params.get('limit', 10)), 50)
        documents = Document.objects.filter(
            status='PUBLISHED'
        ).order_by('-created_at')[:limit]
        
        serializer = self.get_serializer(documents, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def view(self, request, pk=None):
        document = self.get_object()
        document.increment_view_count()
        return Response({'success': True})
    
    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        document = self.get_object()
        document.increment_download_count()
        # In a real implementation, you would serve the file here
        return Response({
            'success': True,
            'url': document.file_url
        })
    
    @action(detail=False, methods=['post'])
    def search(self, request):
        serializer = DocumentSearchSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        
        # Start with all published documents
        queryset = Document.objects.filter(status='PUBLISHED')
        
        # Apply text search
        if data.get('query'):
            queryset = queryset.filter(
                Q(title__icontains=data['query']) |
                Q(description__icontains=data['query']) |
                Q(tags__contains=[data['query']])
            )
        
        # Apply filters
        if data.get('document_type'):
            queryset = queryset.filter(document_type__in=data['document_type'])
        
        if data.get('tags'):
            for tag in data['tags']:
                queryset = queryset.filter(tags__contains=[tag])
        
        if data.get('date_from'):
            queryset = queryset.filter(created_at__date__gte=data['date_from'])
        
        if data.get('date_to'):
            queryset = queryset.filter(created_at__date__lte=data['date_to'])
        
        if data.get('quality_min') is not None:
            queryset = queryset.filter(quality_score__gte=data['quality_min'])
        
        if data.get('quality_max') is not None:
            queryset = queryset.filter(quality_score__lte=data['quality_max'])
        
        # Apply sorting
        sort_field = 'created_at'
        if data['sort_by'] == 'quality':
            sort_field = 'quality_score'
        elif data['sort_by'] == 'views':
            sort_field = 'view_count'
        
        if data['sort_order'] == 'desc':
            sort_field = f'-{sort_field}'
        
        queryset = queryset.order_by(sort_field)
        
        # Pagination
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description', 'tags']
    ordering_fields = ['created_at', 'start_date', 'priority']
    
    def perform_create(self, serializer):
        project = serializer.save(created_by=self.request.user)
        project.team_members.add(self.request.user)
    
    @action(detail=True, methods=['post'])
    def add_member(self, request, pk=None):
        project = self.get_object()
        user_id = request.data.get('user_id')
        
        if not user_id:
            return Response(
                {'error': 'User ID is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = Person.objects.get(id=user_id, is_active=True)
        except Person.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        project.team_members.add(user)
        serializer = self.get_serializer(project)
        return Response(serializer.data)

class WorkspaceViewSet(viewsets.ModelViewSet):
    queryset = Workspace.objects.all()
    serializer_class = WorkspaceSerializer
    permission_classes = [IsAuthenticated, IsWorkspaceMember]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description', 'tags']
    ordering_fields = ['created_at']
    
    def get_queryset(self):
        user = self.request.user
        
        # Show all workspaces for admin
        if user.role == 'ADMIN':
            return Workspace.objects.all()
        
        # Show public workspaces and private workspaces user is a member of
        return Workspace.objects.filter(
            Q(is_private=False) |
            Q(memberships__person=user)
        ).distinct()
    
    def perform_create(self, serializer):
        workspace = serializer.save(created_by=self.request.user)
        
        # Add creator as owner
        WorkspaceMembership.objects.create(
            workspace=workspace,
            person=self.request.user,
            role='OWNER'
        )
    
    @action(detail=True, methods=['post'])
    def add_member(self, request, pk=None):
        workspace = self.get_object()
        user_id = request.data.get('user_id')
        role = request.data.get('role', 'MEMBER')
        
        # Check permissions
        membership = WorkspaceMembership.objects.filter(
            workspace=workspace,
            person=request.user
        ).first()
        
        if not membership or membership.role not in ['OWNER', 'ADMIN']:
            return Response(
                {'error': 'Only owners and admins can add members'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        try:
            user = Person.objects.get(id=user_id, is_active=True)
        except Person.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if already a member
        existing = WorkspaceMembership.objects.filter(
            workspace=workspace,
            person=user
        ).first()
        
        if existing:
            return Response(
                {'error': 'User is already a member'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        WorkspaceMembership.objects.create(
            workspace=workspace,
            person=user,
            role=role
        )
        
        serializer = self.get_serializer(workspace)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def activity(self, request, pk=None):
        workspace = self.get_object()
        
        # Get recent activities (in a real app, this would query an activity log)
        activities = []
        
        # Add recent document uploads
        recent_docs = Document.objects.filter(
            workspace=workspace
        ).order_by('-created_at')[:10]
        
        for doc in recent_docs:
            activities.append({
                'type': 'DOCUMENT_UPLOAD',
                'timestamp': doc.created_at,
                'user': doc.uploader.get_full_name(),
                'document': doc.title,
                'message': f'{doc.uploader.get_full_name()} uploaded "{doc.title}"'
            })
        
        # Sort by timestamp
        activities.sort(key=lambda x: x['timestamp'], reverse=True)
        
        return Response(activities[:20])

class AnalyticsViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated, IsAdminOrKnowledgeChampion]
    
    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        timeframe = request.query_params.get('timeframe', '7days')
        
        # Calculate date range
        end_date = timezone.now()
        if timeframe == '7days':
            start_date = end_date - timedelta(days=7)
        elif timeframe == '30days':
            start_date = end_date - timedelta(days=30)
        elif timeframe == '90days':
            start_date = end_date - timedelta(days=90)
        elif timeframe == 'year':
            start_date = end_date - timedelta(days=365)
        else:
            start_date = end_date - timedelta(days=7)
        
        # Get total documents
        total_documents = Document.objects.count()
        
        # Get document growth
        previous_period_end = start_date - timedelta(days=(end_date - start_date).days)
        previous_period_start = previous_period_end - timedelta(days=(end_date - start_date).days)
        
        current_period_count = Document.objects.filter(
            created_at__range=[start_date, end_date]
        ).count()
        
        previous_period_count = Document.objects.filter(
            created_at__range=[previous_period_start, previous_period_end]
        ).count()
        
        document_growth = 0
        if previous_period_count > 0:
            document_growth = ((current_period_count - previous_period_count) / previous_period_count) * 100
        
        # Get active users (users with activity in last 7 days)
        active_users = Person.objects.filter(
            last_activity__gte=end_date - timedelta(days=7)
        ).count()
        
        # Get average quality score
        avg_quality = Document.objects.filter(
            quality_score__isnull=False
        ).aggregate(Avg('quality_score'))['quality_score__avg'] or 0
        
        # Get workspace count
        workspaces = Workspace.objects.count()
        
        # Get activity trend
        activity_trend = []
        current = start_date
        while current <= end_date:
            next_day = current + timedelta(days=1)
            daily_count = Document.objects.filter(
                created_at__range=[current, next_day]
            ).count()
            
            activity_trend.append({
                'date': current.date().isoformat(),
                'documents': daily_count,
                'users': Person.objects.filter(
                    last_activity__range=[current, next_day]
                ).count(),
                'quality': Document.objects.filter(
                    created_at__range=[current, next_day],
                    quality_score__isnull=False
                ).aggregate(Avg('quality_score'))['quality_score__avg'] or 0
            })
            
            current = next_day
        
        # Get document type distribution
        document_types = Document.objects.values('document_type').annotate(
            count=Count('id')
        ).order_by('-count')
        
        return Response({
            'totalDocuments': total_documents,
            'documentGrowth': round(document_growth, 2),
            'activeUsers': active_users,
            'avgQualityScore': round(avg_quality, 1),
            'activeWorkspaces': workspaces,
            'activityTrend': activity_trend,
            'documentTypes': list(document_types),
            'timeframe': timeframe,
            'period': {
                'start': start_date,
                'end': end_date
            }
        })
    
    @action(detail=False, methods=['get'])
    def skill_gap(self, request):
        # This is a simplified example
        # In a real implementation, this would analyze project requirements vs available skills
        
        skill_gaps = [
            {
                'skill': 'AI/ML Development',
                'required': 15,
                'available': 8,
                'gap': 7,
                'priority': 'HIGH',
                'action': 'Hire External Talent'
            },
            {
                'skill': 'Blockchain Security',
                'required': 10,
                'available': 6,
                'gap': 4,
                'priority': 'MEDIUM',
                'action': 'Training Program'
            },
            {
                'skill': 'Cloud Architecture',
                'required': 20,
                'available': 18,
                'gap': 2,
                'priority': 'LOW',
                'action': 'Internal Development'
            },
            {
                'skill': 'Data Analytics',
                'required': 12,
                'available': 9,
                'gap': 3,
                'priority': 'MEDIUM',
                'action': 'Cross-training'
            },
            {
                'skill': 'DevOps Engineering',
                'required': 8,
                'available': 5,
                'gap': 3,
                'priority': 'HIGH',
                'action': 'Contract Hiring'
            }
        ]
        
        return Response(skill_gaps)
    
    @action(detail=False, methods=['get'])
    def user_engagement(self, request):
        limit = int(request.query_params.get('limit', 10))
        
        # Get recent user activities
        recent_activities = []
        
        # Recent document uploads
        recent_docs = Document.objects.select_related('uploader').order_by('-created_at')[:limit]
        for doc in recent_docs:
            recent_activities.append({
                'timestamp': doc.created_at,
                'user': doc.uploader.get_full_name(),
                'action': 'DOCUMENT_UPLOAD',
                'description': f'Uploaded document: {doc.title}',
                'document_id': str(doc.id)
            })
        
        # Recent validations
        recent_validations = ValidationActivity.objects.select_related(
            'validator', 'document'
        ).order_by('-created_at')[:limit]
        
        for validation in recent_validations:
            recent_activities.append({
                'timestamp': validation.created_at,
                'user': validation.validator.get_full_name(),
                'action': 'VALIDATION',
                'description': f'{validation.action}d document: {validation.document.title}',
                'document_id': str(validation.document.id)
            })
        
        # Sort by timestamp
        recent_activities.sort(key=lambda x: x['timestamp'], reverse=True)
        
        return Response(recent_activities[:limit])