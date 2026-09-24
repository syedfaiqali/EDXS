/**
 * Careers board data, read from the EDXS gateway.
 *
 * The shapes here mirror the DTOs returned by `GET /api/auth/public/careers`
 * (Auth.Service `PublicCareersController`). Only vacancies a client is already
 * advertising are returned, so everything in this file is public information.
 */

// import.meta.env is injected by Vite; guarded so the module can also be loaded
// outside a Vite build (tests, tooling) without blowing up at import time.
const API_BASE_URL = ((import.meta as { env?: Record<string, string> }).env?.VITE_API_BASE_URL
    ?? 'http://localhost:5001').replace(/\/$/, '');

export interface CareerJob {
    id: number;
    vacancyNumber: string;
    jobPortalJobId: string | null;
    clientId: number;
    clientName: string;
    clientCode: string;
    title: string;
    department: string;
    designation: string;
    campus: string;
    employmentType: string;
    openings: number;
    minimumExperienceYears: number | null;
    maximumExperienceYears: number | null;
    description: string;
    responsibilities: string;
    requirements: string;
    qualifications: string;
    postedAtUtc: string;
    closingDate: string | null;
}

export interface CareersClientFacet {
    id: number;
    name: string;
}

export interface CareersFacets {
    clients: CareersClientFacet[];
    departments: string[];
    employmentTypes: string[];
    campuses: string[];
}

export interface CareersResult {
    jobs: CareerJob[];
    total: number;
    page: number;
    pageSize: number;
    facets: CareersFacets;
}

export interface CareersFilters {
    search?: string;
    clientId?: number | null;
    department?: string;
    employmentType?: string;
    campus?: string;
    page?: number;
    pageSize?: number;
}

export const emptyCareersResult: CareersResult = {
    jobs: [],
    total: 0,
    page: 1,
    pageSize: 20,
    facets: { clients: [], departments: [], employmentTypes: [], campuses: [] }
};

/**
 * Fetches one page of the board. Blank filters are left off the query string
 * entirely so the server applies its own defaults.
 */
export const fetchCareers = async (
    filters: CareersFilters,
    signal?: AbortSignal
): Promise<CareersResult> => {
    const params = new URLSearchParams();

    if (filters.search?.trim()) params.set('search', filters.search.trim());
    if (filters.clientId) params.set('clientId', String(filters.clientId));
    if (filters.department) params.set('department', filters.department);
    if (filters.employmentType) params.set('employmentType', filters.employmentType);
    if (filters.campus) params.set('campus', filters.campus);
    if (filters.page && filters.page > 1) params.set('page', String(filters.page));
    if (filters.pageSize) params.set('pageSize', String(filters.pageSize));

    const query = params.toString();
    const response = await fetch(`${API_BASE_URL}/api/auth/public/careers${query ? `?${query}` : ''}`, {
        signal,
        headers: { Accept: 'application/json' }
    });

    if (!response.ok) {
        throw new Error(`Careers request failed (${response.status})`);
    }

    const data = (await response.json()) as Partial<CareersResult>;

    // The board is public and read-only, so a partial response degrades to an
    // empty list rather than breaking the page.
    return {
        jobs: data.jobs ?? [],
        total: data.total ?? 0,
        page: data.page ?? 1,
        pageSize: data.pageSize ?? emptyCareersResult.pageSize,
        facets: {
            clients: data.facets?.clients ?? [],
            departments: data.facets?.departments ?? [],
            employmentTypes: data.facets?.employmentTypes ?? [],
            campuses: data.facets?.campuses ?? []
        }
    };
};

/** Where a candidate applies: the job portal posting when one exists. */
export const buildApplyUrl = (job: CareerJob): string | null => {
    const portalBase = import.meta.env.VITE_JOB_PORTAL_URL as string | undefined;
    if (job.jobPortalJobId && portalBase) {
        return `${portalBase.replace(/\/$/, '')}/jobs/${job.jobPortalJobId}`;
    }
    return null;
};

/** One stage of a job application, mirroring `AdmissionStatusStep`. */
export interface CareerApplicationStatusStep {
    title: string;
    description: string;
    /** done | current | upcoming */
    state: string;
}

/**
 * A candidate's application, shaped like `AdmissionStatus` so the status page
 * can render either journey with one timeline.
 */
export interface CareerApplicationStatus {
    token: string;
    kind: string;
    applicantName: string;
    /** The vacancy applied for, shown where an admission shows the student. */
    positionTitle: string;
    submittedOn: string | null;
    currentStatus: string;
    steps: CareerApplicationStatusStep[];
}

/**
 * Looks up a job application by its reference.
 *
 * The public careers board is read-only today and candidates apply on the One
 * Window job portal, so this endpoint does not exist on the gateway yet. A 404
 * therefore covers both a mistyped reference and a client whose hiring is not
 * tracked here; either way the caller shows "no application found" rather than
 * an error, and the call starts working on its own once the endpoint ships.
 */
export const fetchCareerApplicationStatus = async (
    clientCode: string,
    token: string,
    signal?: AbortSignal
): Promise<CareerApplicationStatus | null> => {
    const response = await fetch(
        `${API_BASE_URL}/api/auth/public/careers/${encodeURIComponent(clientCode)}/status/${encodeURIComponent(token)}`,
        { signal, headers: { Accept: 'application/json' } }
    );

    // 404 is "not recognised"; 501/503 is the endpoint not being deployed yet.
    if (response.status === 404 || response.status === 501 || response.status === 503) {
        return null;
    }

    if (!response.ok) {
        throw new Error(`We could not check that reference just now (${response.status}).`);
    }

    return (await response.json()) as CareerApplicationStatus;
};
