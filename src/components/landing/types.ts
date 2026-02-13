export type OrgType = 'school' | 'college' | 'university' | 'training' | 'corporate';

export interface SelectedOrg {
    type: OrgType;
    name: string;
    subtitle: string;
    description: string;
    color: string;
    lightColor?: string;
}

export interface FormData {
    contactName: string;
    designation: string;
    email: string;
    cellPhone: string;
    landline: string;
    website: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
}

export interface OrgFormData {
    institutionName: string;
    code: string;
    fiscalYear: string;
    visibility: Record<string, boolean>;
    curriculum?: string;
    affiliation?: string;
    hecId?: string;
    logo?: string;
}
