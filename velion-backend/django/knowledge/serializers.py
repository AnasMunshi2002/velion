from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    Person, Document, KnowledgeComponent, Project, 
    Workspace, WorkspaceMembership, BlockchainTransaction,
    AnalyticsComponent, ValidationActivity, ActivityLog
)

User = get_user_model()

class PersonSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Person
        fields = [
            'id', 'email', 'employee_id', 'first_name', 'last_name', 'full_name',
            'role', 'department', 'region', 'skills', 'expertise_level',
            'profile_completion', 'last_activity', 'is_active', 'date_joined'
        ]
        read_only_fields = ['date_joined', 'last_activity']
    
    def get_full_name(self, obj):
        return obj.get_full_name()

class DocumentSerializer(serializers.ModelSerializer):
    uploader_name = serializers.SerializerMethodField()
    file_size_mb = serializers.SerializerMethodField()
    
    class Meta:
        model = Document
        fields = [
            'id', 'title', 'description', 'content_hash', 'blockchain_tx_id',
            'uploader', 'uploader_name', 'status', 'document_type', 'quality_score',
            'metadata', 'tags', 'file_url', 'file_size', 'file_size_mb', 'file_type',
            'version', 'view_count', 'download_count', 'created_at', 'updated_at',
            'published_at'
        ]
        read_only_fields = [
            'content_hash', 'view_count', 'download_count', 'created_at', 'updated_at'
        ]
    
    def get_uploader_name(self, obj):
        return obj.uploader.get_full_name() if obj.uploader else None
    
    def get_file_size_mb(self, obj):
        return obj.get_file_size_mb()

class KnowledgeComponentSerializer(serializers.ModelSerializer):
    document_title = serializers.SerializerMethodField()
    validated_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = KnowledgeComponent
        fields = [
            'id', 'document', 'document_title', 'summary', 'key_topics', 'entities',
            'sentiment_score', 'complexity_score', 'readability_score',
            'validation_status', 'validated_by', 'validated_by_name', 'validated_at',
            'feedback', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def get_document_title(self, obj):
        return obj.document.title if obj.document else None
    
    def get_validated_by_name(self, obj):
        return obj.validated_by.get_full_name() if obj.validated_by else None

class ProjectSerializer(serializers.ModelSerializer):
    created_by_name = serializers.SerializerMethodField()
    duration_days = serializers.SerializerMethodField()
    team_members_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Project
        fields = [
            'id', 'name', 'description', 'start_date', 'end_date', 'status',
            'budget', 'priority', 'tags', 'created_by', 'created_by_name',
            'duration_days', 'team_members_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def get_created_by_name(self, obj):
        return obj.created_by.get_full_name() if obj.created_by else None
    
    def get_duration_days(self, obj):
        return obj.get_duration_days()
    
    def get_team_members_count(self, obj):
        return obj.team_members.count()

class WorkspaceSerializer(serializers.ModelSerializer):
    created_by_name = serializers.SerializerMethodField()
    member_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Workspace
        fields = [
            'id', 'name', 'description', 'workspace_type', 'project',
            'created_by', 'created_by_name', 'is_private', 'tags',
            'member_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def get_created_by_name(self, obj):
        return obj.created_by.get_full_name() if obj.created_by else None
    
    def get_member_count(self, obj):
        return obj.memberships.count()

class WorkspaceMembershipSerializer(serializers.ModelSerializer):
    person_name = serializers.SerializerMethodField()
    workspace_name = serializers.SerializerMethodField()
    
    class Meta:
        model = WorkspaceMembership
        fields = [
            'id', 'workspace', 'workspace_name', 'person', 'person_name',
            'role', 'joined_at', 'last_accessed'
        ]
        read_only_fields = ['joined_at', 'last_accessed']
    
    def get_person_name(self, obj):
        return obj.person.get_full_name() if obj.person else None
    
    def get_workspace_name(self, obj):
        return obj.workspace.name if obj.workspace else None

class BlockchainTransactionSerializer(serializers.ModelSerializer):
    document_title = serializers.SerializerMethodField()
    
    class Meta:
        model = BlockchainTransaction
        fields = [
            'id', 'document', 'document_title', 'transaction_hash', 'block_number',
            'network', 'status', 'gas_used', 'confirmation_time', 'created_at',
            'verified_at'
        ]
        read_only_fields = ['created_at', 'verified_at']
    
    def get_document_title(self, obj):
        return obj.document.title if obj.document else None

class AnalyticsComponentSerializer(serializers.ModelSerializer):
    generated_by_name = serializers.SerializerMethodField()
    
    class Meta:
        model = AnalyticsComponent
        fields = [
            'id', 'report_type', 'parameters', 'generated_at', 'timeframe_start',
            'timeframe_end', 'results', 'insights', 'recommendations',
            'generated_by', 'generated_by_name', 'is_scheduled', 'schedule_frequency'
        ]
        read_only_fields = ['generated_at']
    
    def get_generated_by_name(self, obj):
        return obj.generated_by.get_full_name() if obj.generated_by else None

class ValidationActivitySerializer(serializers.ModelSerializer):
    validator_name = serializers.SerializerMethodField()
    document_title = serializers.SerializerMethodField()
    
    class Meta:
        model = ValidationActivity
        fields = [
            'id', 'document', 'document_title', 'validator', 'validator_name',
            'action', 'feedback', 'previous_status', 'new_status', 'created_at'
        ]
        read_only_fields = ['created_at']
    
    def get_validator_name(self, obj):
        return obj.validator.get_full_name() if obj.validator else None
    
    def get_document_title(self, obj):
        return obj.document.title if obj.document else None

class ActivityLogSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    
    class Meta:
        model = ActivityLog
        fields = [
            'id', 'user', 'user_name', 'action', 'description', 'ip_address',
            'user_agent', 'metadata', 'created_at'
        ]
        read_only_fields = ['created_at']
    
    def get_user_name(self, obj):
        return obj.user.get_full_name() if obj.user else None

# Search serializers
class DocumentSearchSerializer(serializers.Serializer):
    query = serializers.CharField(required=False)
    document_type = serializers.ListField(
        child=serializers.CharField(),
        required=False
    )
    tags = serializers.ListField(
        child=serializers.CharField(),
        required=False
    )
    date_from = serializers.DateField(required=False)
    date_to = serializers.DateField(required=False)
    quality_min = serializers.IntegerField(min_value=0, max_value=100, required=False)
    quality_max = serializers.IntegerField(min_value=0, max_value=100, required=False)
    page = serializers.IntegerField(min_value=1, default=1)
    limit = serializers.IntegerField(min_value=1, max_value=100, default=20)
    sort_by = serializers.ChoiceField(
        choices=['relevance', 'date', 'quality', 'views'],
        default='relevance'
    )
    sort_order = serializers.ChoiceField(
        choices=['asc', 'desc'],
        default='desc'
    )

class GraphQuerySerializer(serializers.Serializer):
    entity_id = serializers.UUIDField(required=False)
    entity_type = serializers.ChoiceField(
        choices=['document', 'person', 'topic', 'project'],
        required=False
    )
    depth = serializers.IntegerField(min_value=1, max_value=5, default=2)
    limit = serializers.IntegerField(min_value=1, max_value=500, default=100)