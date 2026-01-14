from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.contrib.postgres.fields import ArrayField
from django.utils import timezone
import uuid

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'ADMIN')
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self.create_user(email, password, **extra_fields)

class Person(AbstractUser):
    ROLE_CHOICES = [
        ('ADMIN', 'Administrator'),
        ('KNOWLEDGE_CHAMPION', 'Knowledge Champion'),
        ('CONSULTANT', 'Consultant'),
        ('MANAGER', 'Manager'),
        ('USER', 'User'),
    ]
    
    username = None  # Remove username field
    email = models.EmailField(unique=True)
    employee_id = models.CharField(max_length=50, unique=True)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='USER')
    department = models.CharField(max_length=100, blank=True)
    region = models.CharField(max_length=100, blank=True)
    skills = ArrayField(models.CharField(max_length=100), default=list, blank=True)
    expertise_level = models.CharField(max_length=20, choices=[
        ('JUNIOR', 'Junior'),
        ('INTERMEDIATE', 'Intermediate'),
        ('SENIOR', 'Senior'),
        ('LEAD', 'Lead')
    ], default='INTERMEDIATE')
    profile_completion = models.IntegerField(default=0)
    last_activity = models.DateTimeField(default=timezone.now)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['employee_id']
    
    objects = UserManager()
    
    class Meta:
        db_table = 'person'
        verbose_name = 'Person'
        verbose_name_plural = 'People'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.get_full_name()} ({self.employee_id})"
    
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip()
    
    def update_profile_completion(self):
        total_fields = 8
        completed_fields = sum([
            1 if self.first_name else 0,
            1 if self.last_name else 0,
            1 if self.email else 0,
            1 if self.region else 0,
            1 if self.department else 0,
            1 if self.skills else 0,
            1 if self.expertise_level else 0,
            1 if self.profile_completion else 0,
        ])
        self.profile_completion = int((completed_fields / total_fields) * 100)
        self.save()
    
    def record_activity(self):
        self.last_activity = timezone.now()
        self.save()

class Document(models.Model):
    STATUS_CHOICES = [
        ('DRAFT', 'Draft'),
        ('PENDING_REVIEW', 'Pending Review'),
        ('UNDER_REVIEW', 'Under Review'),
        ('APPROVED', 'Approved'),
        ('PUBLISHED', 'Published'),
        ('ARCHIVED', 'Archived'),
        ('REJECTED', 'Rejected')
    ]
    
    TYPE_CHOICES = [
        ('PROPOSAL', 'Proposal'),
        ('REPORT', 'Report'),
        ('PRESENTATION', 'Presentation'),
        ('CONTRACT', 'Contract'),
        ('RESEARCH', 'Research'),
        ('GUIDELINE', 'Guideline'),
        ('TEMPLATE', 'Template'),
        ('OTHER', 'Other')
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=500)
    description = models.TextField(blank=True)
    content_hash = models.CharField(max_length=256)  # For blockchain verification
    blockchain_tx_id = models.CharField(max_length=500, blank=True, null=True)
    uploader = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='uploaded_documents')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='DRAFT')
    document_type = models.CharField(max_length=50, choices=TYPE_CHOICES, default='OTHER')
    quality_score = models.FloatField(null=True, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    tags = ArrayField(models.CharField(max_length=100), default=list, blank=True)
    file_url = models.URLField(max_length=1000)
    file_size = models.BigIntegerField()  # In bytes
    file_type = models.CharField(max_length=100)
    version = models.IntegerField(default=1)
    view_count = models.IntegerField(default=0)
    download_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'document'
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
            models.Index(fields=['quality_score']),
            models.Index(fields=['tags']),
        ]
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} (v{self.version})"
    
    def get_file_size_mb(self):
        return round(self.file_size / (1024 * 1024), 2)
    
    def increment_view_count(self):
        self.view_count += 1
        self.save()
    
    def increment_download_count(self):
        self.download_count += 1
        self.save()
    
    def increment_version(self):
        self.version += 1
        self.status = 'DRAFT'
        self.save()

class KnowledgeComponent(models.Model):
    document = models.OneToOneField(Document, on_delete=models.CASCADE, 
                                   related_name='knowledge_component')
    summary = models.TextField()
    key_topics = ArrayField(models.CharField(max_length=200), default=list, blank=True)
    entities = models.JSONField(default=list, blank=True)  # Named entities extracted
    sentiment_score = models.FloatField(null=True, blank=True)  # -1 to 1
    complexity_score = models.FloatField(null=True, blank=True)  # 0-1 scale
    readability_score = models.FloatField(null=True, blank=True)
    validation_status = models.CharField(max_length=50, choices=[
        ('PENDING', 'Pending'),
        ('VALIDATED', 'Validated'),
        ('FLAGGED', 'Flagged'),
        ('REQUIRES_REVIEW', 'Requires Review')
    ], default='PENDING')
    validated_by = models.ForeignKey(Person, on_delete=models.SET_NULL, 
                                    null=True, blank=True, related_name='validated_components')
    validated_at = models.DateTimeField(null=True, blank=True)
    feedback = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'knowledge_component'
    
    def __str__(self):
        return f"Knowledge Component for {self.document.title}"
    
    def validate(self, validator, feedback=None):
        self.validation_status = 'VALIDATED'
        self.validated_by = validator
        self.validated_at = timezone.now()
        if feedback:
            self.feedback = feedback
        self.save()

class Project(models.Model):
    STATUS_CHOICES = [
        ('PLANNING', 'Planning'),
        ('ACTIVE', 'Active'),
        ('ON_HOLD', 'On Hold'),
        ('COMPLETED', 'Completed'),
        ('ARCHIVED', 'Archived')
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    description = models.TextField()
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='PLANNING')
    budget = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    priority = models.CharField(max_length=20, choices=[
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
        ('CRITICAL', 'Critical')
    ], default='MEDIUM')
    tags = ArrayField(models.CharField(max_length=100), default=list, blank=True)
    created_by = models.ForeignKey(Person, on_delete=models.CASCADE, 
                                  related_name='created_projects')
    team_members = models.ManyToManyField(Person, related_name='projects', blank=True)
    documents = models.ManyToManyField(Document, related_name='projects', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'project'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name
    
    def get_duration_days(self):
        if self.end_date:
            return (self.end_date - self.start_date).days
        return (timezone.now().date() - self.start_date).days

class Workspace(models.Model):
    TYPE_CHOICES = [
        ('PROJECT', 'Project Workspace'),
        ('DEPARTMENT', 'Department Workspace'),
        ('INTEREST', 'Interest Group'),
        ('CLIENT', 'Client Workspace')
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    workspace_type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, 
                               related_name='workspaces', null=True, blank=True)
    created_by = models.ForeignKey(Person, on_delete=models.CASCADE, 
                                  related_name='created_workspaces')
    is_private = models.BooleanField(default=False)
    tags = ArrayField(models.CharField(max_length=100), default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'workspace'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.name} ({self.workspace_type})"

class WorkspaceMembership(models.Model):
    ROLE_CHOICES = [
        ('OWNER', 'Owner'),
        ('ADMIN', 'Admin'),
        ('MEMBER', 'Member'),
        ('GUEST', 'Guest')
    ]
    
    workspace = models.ForeignKey(Workspace, on_delete=models.CASCADE, related_name='memberships')
    person = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='workspace_memberships')
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='MEMBER')
    joined_at = models.DateTimeField(auto_now_add=True)
    last_accessed = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'workspace_membership'
        unique_together = ['workspace', 'person']
    
    def __str__(self):
        return f"{self.person} - {self.role} in {self.workspace}"

class BlockchainTransaction(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('CONFIRMED', 'Confirmed'),
        ('FAILED', 'Failed'),
        ('EXPIRED', 'Expired')
    ]
    
    NETWORK_CHOICES = [
        ('ETHEREUM_MAINNET', 'Ethereum Mainnet'),
        ('ETHEREUM_TESTNET', 'Ethereum Testnet'),
        ('HYPERLEDGER', 'Hyperledger'),
        ('CUSTOM', 'Custom Network')
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    document = models.ForeignKey(Document, on_delete=models.CASCADE, 
                                related_name='blockchain_transactions')
    transaction_hash = models.CharField(max_length=256, unique=True)
    block_number = models.BigIntegerField(null=True, blank=True)
    network = models.CharField(max_length=50, choices=NETWORK_CHOICES)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='PENDING')
    gas_used = models.BigIntegerField(null=True, blank=True)
    confirmation_time = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    verified_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'blockchain_transaction'
        indexes = [
            models.Index(fields=['transaction_hash']),
            models.Index(fields=['status']),
            models.Index(fields=['created_at']),
        ]
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Tx: {self.transaction_hash[:20]}... ({self.status})"

class AnalyticsComponent(models.Model):
    REPORT_TYPE_CHOICES = [
        ('SKILL_GAP', 'Skill Gap Analysis'),
        ('KNOWLEDGE_GROWTH', 'Knowledge Growth'),
        ('USER_ENGAGEMENT', 'User Engagement'),
        ('DOCUMENT_QUALITY', 'Document Quality Trends'),
        ('COLLABORATION_PATTERNS', 'Collaboration Patterns')
    ]
    
    report_type = models.CharField(max_length=50, choices=REPORT_TYPE_CHOICES)
    parameters = models.JSONField(default=dict, blank=True)
    generated_at = models.DateTimeField(auto_now_add=True)
    timeframe_start = models.DateTimeField()
    timeframe_end = models.DateTimeField()
    results = models.JSONField(default=dict, blank=True)
    insights = models.TextField(blank=True)
    recommendations = models.JSONField(default=list, blank=True)
    generated_by = models.ForeignKey(Person, on_delete=models.SET_NULL, 
                                    null=True, blank=True)
    is_scheduled = models.BooleanField(default=False)
    schedule_frequency = models.CharField(max_length=50, blank=True, 
                                         choices=[('DAILY', 'Daily'), 
                                                 ('WEEKLY', 'Weekly'),
                                                 ('MONTHLY', 'Monthly')])
    
    class Meta:
        db_table = 'analytics_component'
        ordering = ['-generated_at']
    
    def __str__(self):
        return f"{self.report_type} - {self.generated_at.date()}"

class ValidationActivity(models.Model):
    ACTION_CHOICES = [
        ('APPROVE', 'Approve'),
        ('REJECT', 'Reject'),
        ('REQUEST_CHANGES', 'Request Changes')
    ]
    
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='validation_activities')
    validator = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='validation_activities')
    action = models.CharField(max_length=50, choices=ACTION_CHOICES)
    feedback = models.TextField(blank=True)
    previous_status = models.CharField(max_length=50)
    new_status = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'validation_activity'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.validator} {self.action}d {self.document}"

class ActivityLog(models.Model):
    ACTION_CHOICES = [
        ('LOGIN', 'User Login'),
        ('LOGOUT', 'User Logout'),
        ('DOCUMENT_UPLOAD', 'Document Upload'),
        ('DOCUMENT_VIEW', 'Document View'),
        ('DOCUMENT_DOWNLOAD', 'Document Download'),
        ('SEARCH', 'Search'),
        ('WORKSPACE_CREATE', 'Workspace Created'),
        ('WORKSPACE_JOIN', 'Workspace Joined'),
        ('COMMENT', 'Comment Added'),
        ('VALIDATION', 'Document Validation'),
        ('SETTINGS_UPDATE', 'Settings Updated'),
        ('PROFILE_UPDATE', 'Profile Updated'),
    ]
    
    user = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='activity_logs')
    action = models.CharField(max_length=50, choices=ACTION_CHOICES)
    description = models.TextField()
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'activity_log'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'action']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.user} - {self.action} at {self.created_at}"