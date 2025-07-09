export interface Technician {
  id: number;
  name: string;
  specialization: string;
  contactNumber: string;
  email: string;
  isAvailable: boolean;
}

export type InterferenceType = 'TV_SIGNAL_LOSS' | 'TV_DISTORTION' | 'TV_AUDIO_ISSUES' | 
                             'TV_CHANNEL_FREEZING' | 'TV_PIXELATION' | 
                             'INTERNET_SLOW' | 'INTERNET_INTERMITTENT' | 'INTERNET_NO_CONNECTION' |
                             'INTERNET_HIGH_LATENCY' | 'OTHER';

export interface InternetDetails {
  downloadSpeed?: number;  // in Mbps
  uploadSpeed?: number;    // in Mbps
  latency?: number;       // in ms
  packetLoss?: number;    // percentage
  routerModel?: string;
  modemModel?: string;
  wifiAffected: boolean;
  ethernetAffected: boolean;
}

export interface InterferenceReport {
  id: number;
  reporterName: string;
  address: string;
  phoneNumber: string;
  email: string;
  serviceType: 'TV' | 'INTERNET' | 'BOTH';
  channelAffected?: string;
  interferenceType: InterferenceType;
  description: string;
  timeObserved: Date;
  status: 'pending' | 'investigating' | 'resolved';
  assignedTechnician?: Technician;
  assignedAt?: Date;
  technicianNotes?: string;
  internetDetails?: InternetDetails;
  createdAt: Date;
  updatedAt: Date;
} 