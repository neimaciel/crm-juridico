import { 
  Client, Message, User, Document, Note, Task, 
  TimelineEvent, Financial, RelatedParty, Deadline 
} from './types';

export const currentUser: User = {
  id: '1',
  name: 'Dr. Amanda Silva',
  email: 'amanda.silva@lawfirm.com',
  role: 'partner',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
  permissions: [
    'manage_clients',
    'view_documents',
    'upload_documents',
    'delete_documents',
    'manage_users',
    'view_all_cases',
    'manage_financials',
    'view_reports',
    'manage_calendar',
    'approve_documents'
  ],
  specialties: ['civil', 'corporate'],
  position: 'Senior Partner',
  oabNumber: '123456',
  availability: 'available'
};

const sampleDocuments: Document[] = [
  {
    id: '1',
    name: 'Petição Inicial.pdf',
    type: 'application/pdf',
    category: 'petition',
    size: 2500000,
    uploadedAt: '2024-03-15T10:00:00Z',
    uploadedBy: currentUser,
    url: '#',
    version: 1,
    tags: ['initial', 'reviewed'],
    accessLevel: 'internal'
  }
];

const sampleNotes: Note[] = [
  {
    id: '1',
    content: 'Cliente apresentou novos documentos para análise',
    createdAt: '2024-03-15T10:00:00Z',
    createdBy: currentUser,
    visibility: 'team',
    tags: ['document-review']
  }
];

export const initialMessages: Message[] = [
  {
    id: '1',
    clientId: '1',
    content: 'Bom dia, gostaria de agendar uma reunião',
    timestamp: '2024-03-15T09:00:00Z',
    type: 'whatsapp',
    sender: 'client',
    status: 'read'
  },
  {
    id: '2',
    clientId: '1',
    content: 'Claro! Podemos agendar para amanhã às 14h?',
    timestamp: '2024-03-15T09:05:00Z',
    type: 'whatsapp',
    sender: 'lawyer',
    status: 'read'
  }
];

const sampleTasks: Task[] = [
  {
    id: '1',
    title: 'Preparar petição inicial',
    description: 'Elaborar petição inicial com base nos documentos fornecidos',
    dueDate: '2024-03-20T14:00:00Z',
    status: 'pending',
    priority: 'high',
    assignedTo: currentUser,
    createdBy: currentUser,
    createdAt: '2024-03-15T10:00:00Z',
    reminderTimes: ['3_days', '1_day'],
    clientId: '1',
    billable: true,
    checklist: [
      {
        id: '1',
        content: 'Revisar documentos do cliente',
        completed: false
      },
      {
        id: '2',
        content: 'Pesquisar jurisprudência',
        completed: false
      }
    ]
  }
];

const sampleFinancials: Financial[] = [
  {
    id: '1',
    type: 'fee',
    amount: 5000,
    currency: 'BRL',
    status: 'pending',
    dueDate: '2024-04-15',
    description: 'Honorários iniciais',
    category: 'legal_fees'
  }
];

const sampleTimeline: TimelineEvent[] = [
  {
    id: '1',
    type: 'document_filed',
    date: '2024-03-15T10:00:00Z',
    description: 'Petição inicial protocolada',
    createdBy: currentUser,
    relatedEntities: {
      documents: ['1']
    }
  }
];

const sampleRelatedParties: RelatedParty[] = [
  {
    id: '1',
    name: 'Empresa XYZ Ltda',
    type: 'opposing_party',
    contact: {
      email: 'contato@xyz.com',
      phone: '11 3333-4444'
    },
    representation: {
      lawyer: 'Dr. José Santos',
      lawFirm: 'Santos & Associados'
    }
  }
];

const sampleDeadlines: Deadline[] = [
  {
    id: '1',
    title: 'Prazo para contestação',
    date: '2024-04-05T23:59:59Z',
    type: 'court',
    priority: 'high',
    description: 'Prazo fatal para apresentação da contestação',
    relatedTasks: ['1'],
    notifications: ['3_days', '1_day'],
    status: 'pending'
  }
];

export const initialClients: Client[] = [
  {
    id: '1',
    name: 'João Silva',
    caseNumber: 'PROC-2024-001',
    status: 'new',
    priority: 'high',
    caseType: 'litigation',
    practiceArea: 'civil',
    nextHearing: '2024-04-15',
    description: 'Processo de indenização por danos morais',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    email: 'joao.silva@email.com',
    phone: '+55 11 98765-4321',
    address: 'Rua das Flores, 123 - São Paulo, SP',
    documents: sampleDocuments,
    notes: sampleNotes,
    tasks: sampleTasks,
    financials: sampleFinancials,
    timeline: sampleTimeline,
    relatedParties: sampleRelatedParties,
    assignedTeam: [currentUser],
    deadlines: sampleDeadlines
  }
];