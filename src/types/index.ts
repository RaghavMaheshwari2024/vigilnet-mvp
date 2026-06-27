export interface CaseItem {
  id: string;
  title: string;
  type: string;
  risk: number;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'New' | 'Open' | 'In Review' | 'Cleared' | 'STR Filed';
  assignee: string;
  timestamp: string;
  volume: string;
  description: string;
  evidence: {
    customerProfile: {
      name: string;
      type: string;
      jurisdiction: string;
      kycStatus: 'Verified' | 'Pending' | 'Failed';
      watchlistMatch: boolean;
      pepFlag: boolean;
      ubo: string;
    };
    behaviourAnalysis: {
      avgAmount: string;
      velocity24h: number;
      anomalyScore: number;
      timePattern: string;
      riskIndicators: string[];
    };
    graphAnalysis: {
      hopsToWatchlist: number;
      cyclesDetected: number;
      inDegree: number;
      outDegree: number;
      suspectPath: string;
    };
    communityDetection: {
      clusterId: string;
      density: number;
      clusterSize: number;
      avgCommunityRisk: number;
      modularityScore: number;
    };
    riskMemory: {
      pageRank: number;
      lstmStateScore: number;
      historicalRiskTrend: 'Rising' | 'Stable' | 'Declining';
      memoryScore: number;
    };
    deviceIntelligence: {
      ipAddress: string;
      location: string;
      vpnDetected: boolean;
      deviceFingerprint: string;
      loginAnomalies: number;
    };
  };
}

export interface StrReport {
  reportId: string;
  caseId: string;
  creationDate: string;
  reportingOfficer: string;
  riskPercent: number;
  customerDetails: {
    name: string;
    accountNumber: string;
    occupation: string;
    kycStatus: string;
    jurisdiction: string;
    uboDetails: string;
  };
  transactionSummary: {
    volume: string;
    method: string;
    destination: string;
    dates: string;
  };
  behaviourAnalysis: string;
  graphAnalysis: string;
  evidenceList: string;
  reasonForSuspicion: string;
  aiRecommendation: string;
}

export interface OfficerReport {
  id: string;
  caseId: string;
  subjectName: string;
  volume: string;
  analyst: string;
  dateEscalated: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  reasonForSuspicion: string;
  analystNotes: string;
  officerComments?: string;
}
