export interface PersonalInfo {
	name?: string;
	title?: string;
	email?: string;
	phone?: string;
	location?: string;
	website?: string;
	linkedin?: string;
	github?: string;
	avatar?: string;
    summary?: string;
}


export interface Experience {
    company?: string;
    position?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    current?: boolean;
    description?: string;
}

export interface Education {
    degree?: string;
    institution?: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    gpa?: string;
    description?: string;
}

export interface Skill {
    category?: string;
    level?: string;
    items?: string[];
    description?: string;
}

export interface Project {
    title?: string;
    description?: string;
    technologies?: string[];
    url?: string;
    github?: string;
    startDate?: string;
    endDate?: string;
}

export interface Award {
    title?: string;
    issuer?: string;
    dateReceived?: string;
    expiryDate?: string;
    description?: string;
    verificationUrl?: string;
}

export interface Language {
    language?: string;
    level?: string;
    certification?: string;
    score?: string;
    description?: string;
}

export interface Interest {
    category?: string;
    items?: string[];
    description?: string;
}

export interface Course {
    title?: string;
    provider?: string;
    duration?: string;
    completionDate?: string;
    certificateUrl?: string;
    description?: string;
}

export interface Organization {
    name?: string;
    role?: string;
    startDate?: string;
    endDate?: string;
    current?: boolean;
    description?: string;
}

export interface Publication {
    title?: string;
    authors?: string[];
    venue?: string;
    date?: string;
    doi?: string;
    url?: string;
    description?: string;
}

export interface Reference {
    name?: string;
    title?: string;
    company?: string;
    email?: string;
    phone?: string;
    relationship?: string;
}

export interface Declaration {
    statement?: string;
    place?: string;
    date?: string;
    signature?: string;
}

export interface CustomSection {
    title?: string;
    subtitle?: string;
    content?: string;
    url?: string;
}
