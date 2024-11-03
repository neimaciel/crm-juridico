// ... existing imports and types ...

export type LeadStatus = 
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'proposal'
  | 'negotiation'
  | 'won'
  | 'lost';

export interface Lead {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  status: LeadStatus;
  source: string;
  value: number;
  assignedTo: User;
  createdAt: string;
  lastContact?: string;
  nextFollowUp?: string;
  notes: Note[];
  tags: string[];
  customFields: Record<string, any>;
}

export interface Pipeline {
  id: string;
  name: string;
  stages: PipelineStage[];
  createdAt: string;
  updatedAt: string;
}

export interface PipelineStage {
  id: string;
  name: string;
  order: number;
  color: string;
  probability: number;
  leads: Lead[];
}

export interface AutomationRule {
  id: string;
  name: string;
  trigger: {
    type: 'lead_status_change' | 'task_completed' | 'email_opened' | 'form_submitted';
    conditions: {
      field: string;
      operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
      value: any;
    }[];
  };
  actions: {
    type: 'create_task' | 'send_email' | 'update_lead' | 'notify_user';
    params: Record<string, any>;
  }[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  variables: string[];
  category: 'follow_up' | 'proposal' | 'welcome' | 'custom';
  createdAt: string;
  updatedAt: string;
}

export interface LeadForm {
  id: string;
  name: string;
  fields: {
    id: string;
    type: 'text' | 'email' | 'phone' | 'select' | 'textarea';
    label: string;
    required: boolean;
    options?: string[];
  }[];
  successMessage: string;
  notificationEmails: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Report {
  id: string;
  name: string;
  type: 'pipeline' | 'conversion' | 'activity' | 'revenue';
  filters: {
    dateRange: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';
    customDateRange?: {
      start: string;
      end: string;
    };
    users?: string[];
    pipelines?: string[];
    tags?: string[];
  };
  metrics: {
    id: string;
    name: string;
    calculation: string;
    format: 'number' | 'currency' | 'percentage';
  }[];
  visualization: 'table' | 'bar' | 'line' | 'pie';
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    recipients: string[];
  };
  createdAt: string;
  updatedAt: string;
}

// Update existing types
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  permissions: Permission[];
  specialties: PracticeArea[];
  position: string;
  oabNumber?: string;
  availability: 'available' | 'in-court' | 'busy' | 'away';
  teams?: string[];
  settings: {
    notifications: {
      email: boolean;
      push: boolean;
      desktop: boolean;
    };
    theme: 'light' | 'dark' | 'system';
    language: string;
    timezone: string;
  };
}

export type Permission = 
  | 'manage_clients'
  | 'view_documents'
  | 'upload_documents'
  | 'delete_documents'
  | 'manage_users'
  | 'view_all_cases'
  | 'manage_financials'
  | 'view_reports'
  | 'manage_calendar'
  | 'approve_documents'
  | 'manage_leads'
  | 'manage_pipeline'
  | 'manage_automation'
  | 'manage_templates'
  | 'send_mass_emails'
  | 'manage_integrations';