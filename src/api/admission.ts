/**
 * Admission data, read from the EDXS gateway.
 *
 * These mirror the DTOs on FrontOffice.Service's `PublicAdmissionController`.
 * The board lists admission registers schools have marked Published on their
 * back-office Admission Register screen, so nothing appears here that a school
 * has not chosen to advertise. An enquiry submitted against one lands in the
 * same table the back office reads.
 */

// import.meta.env is injected by Vite; guarded so the module can also be loaded
// outside a Vite build (tests, tooling) without blowing up at import time.
const viteEnv = (import.meta as {
    env?: { VITE_API_BASE_URL?: string; DEV?: boolean };
}).env;

// The Vite dev server proxies /api to the local gateway. Keeping local calls
// relative avoids a browser CORS request from localhost:5173 to localhost:5001.
const API_BASE_URL = viteEnv?.DEV
    ? ''
    : (viteEnv?.VITE_API_BASE_URL ?? 'http://localhost:5001').replace(/\/$/, '');

/** A class or programme a register accepts applications for. */
export interface AdmissionProgram {
    id: number;
    name: string;
    seats: number | null;
    /** Subjects taught on the programme; empty when no syllabus is recorded. */
    subjects: string[];
}

/** One school's published intake at one campus. */
export interface AdmissionRegister {
    id: number;
    name: string;
    registerNo: string;
    academicSession: string;
    schoolCode: string;
    schoolName: string;
    hasLogo: boolean;
    campusId: number;
    campusName: string;
    city: string;
    startDate: string | null;
    endDate: string | null;
    totalSeats: number | null;
    programs: AdmissionProgram[];
}

/**
 * Where a school's logo is served from. The images are around a megabyte each,
 * so they are fetched per-card and cached by the browser rather than inlined
 * into the board response.
 */
export const schoolLogoUrl = (schoolCode: string): string =>
    `${API_BASE_URL}/api/FrontOffice/public/admission/schools/${encodeURIComponent(schoolCode)}/logo`;

export interface AdmissionSchoolFacet {
    code: string;
    name: string;
}

export interface AdmissionBoard {
    registers: AdmissionRegister[];
    total: number;
    schools: AdmissionSchoolFacet[];
    cities: string[];
}

export interface AdmissionBoardFilters {
    search?: string;
    schoolCode?: string;
    city?: string;
}

export const emptyAdmissionBoard: AdmissionBoard = {
    registers: [],
    total: 0,
    schools: [],
    cities: []
};

export interface AdmissionEnquiryRequest {
    fullName: string;
    email: string;
    phone?: string;
    studentName?: string;
    programOfInterest?: string;
    gradeLevel?: string;
    campusId?: number;
    registerId?: number;
    /** The class or programme applied for. Required by the server. */
    classId: number;
    /** Optional campus scope, validated by the public API against the client. */
    entityId?: number;
    message?: string;
}

export interface AdmissionEnquiryResult {
    /** The enquiry number, which is also the token for the status lookup. */
    token: string;
    emailSent: boolean;
    message: string;
}

/** Details collected by the marketing site's "Get A Demo" form. */
export interface DemoEnquiryRequest {
    fullName: string;
    email: string;
    phone: string;
    organisationName?: string;
    message?: string;
    numberOfPersons: number;
    entityId?: number;
}

export interface AdmissionStatusStep {
    title: string;
    description: string;
    /** done | current | upcoming */
    state: string;
}

export interface AdmissionStatus {
    token: string;
    kind: string;
    applicantName: string;
    studentName: string;
    submittedOn: string | null;
    currentStatus: string;
    steps: AdmissionStatusStep[];
}

/** Reads an error message the API returned, falling back to a readable default. */
const readError = async (response: Response, fallback: string): Promise<string> => {
    try {
        const body = await response.json();
        if (body && typeof body.error === 'string' && body.error.trim()) {
            return body.error;
        }
    } catch {
        // A non-JSON body is not worth surfacing; the fallback reads better.
    }
    return fallback;
};

/** A school in the public admissions directory. */
export interface AdmissionSchool {
    code: string;
    name: string;
    city: string;
    hasLogo: boolean;
}

/**
 * Every school in the directory, not just those with an open intake: someone
 * checking an application they submitted months ago still needs to find their
 * school in the list.
 */
export const fetchAdmissionSchools = async (signal?: AbortSignal): Promise<AdmissionSchool[]> => {
    const response = await fetch(`${API_BASE_URL}/api/FrontOffice/public/admission/schools`, {
        signal,
        headers: { Accept: 'application/json' }
    });

    if (!response.ok) {
        throw new Error(`Schools request failed (${response.status})`);
    }

    const data = (await response.json()) as AdmissionSchool[] | null;
    return Array.isArray(data) ? data : [];
};

/** One scheduled period on a programme's weekly timetable. */
export interface AdmissionPeriod {
    day: string;
    /** Monday = 1, so the list can be grouped without parsing day names. */
    dayOrder: number;
    startTime: string;
    endTime: string;
    subject: string;
    teacher: string;
    /** Semester the period's subject belongs to; empty when none is recorded. */
    semester: string;
    /** Position of the semester in teaching order. */
    semesterOrder: number;
}

/** One subject on a programme, with the semester it is taught in. */
export interface AdmissionSubject {
    name: string;
    /** What the subject covers; blank when the school has not recorded one. */
    description: string;
    semester: string;
    semesterOrder: number;
}

/** What a programme teaches, when, and who takes each period. */
export interface AdmissionProgramDetail {
    id: number;
    name: string;
    subjects: string[];
    /** The subjects with their semesters, for the semester-wise outline. */
    courseOutline: AdmissionSubject[];
    /** Semester names in teaching order; empty when none are recorded. */
    semesters: string[];
    periods: AdmissionPeriod[];
    teachers: string[];
}

/**
 * The syllabus and timetable for one programme. Fetched on demand rather than
 * with the board, since a single school class can carry over a thousand periods.
 */
export const fetchProgramDetail = async (
    registerId: number,
    programId: number,
    signal?: AbortSignal
): Promise<AdmissionProgramDetail> => {
    const response = await fetch(
        `${API_BASE_URL}/api/FrontOffice/public/admission/registers/${registerId}/programs/${programId}`,
        { signal, headers: { Accept: 'application/json' } }
    );

    if (!response.ok) {
        throw new Error(`Programme request failed (${response.status})`);
    }

    const data = (await response.json()) as Partial<AdmissionProgramDetail> | null;
    return {
        id: data?.id ?? programId,
        name: data?.name ?? '',
        subjects: data?.subjects ?? [],
        // Normalised per entry: a gateway predating the description field would
        // otherwise hand the UI `undefined` where it expects a string.
        courseOutline: (data?.courseOutline ?? []).map((subject) => ({
            name: subject?.name ?? '',
            description: subject?.description ?? '',
            semester: subject?.semester ?? '',
            semesterOrder: subject?.semesterOrder ?? 0
        })),
        semesters: data?.semesters ?? [],
        periods: data?.periods ?? [],
        teachers: data?.teachers ?? []
    };
};

/** Every admission register schools are currently advertising. */
export const fetchAdmissionBoard = async (
    filters: AdmissionBoardFilters,
    signal?: AbortSignal
): Promise<AdmissionBoard> => {
    const params = new URLSearchParams();
    if (filters.search?.trim()) params.set('search', filters.search.trim());
    if (filters.schoolCode) params.set('schoolCode', filters.schoolCode);
    if (filters.city) params.set('city', filters.city);

    const query = params.toString();
    const response = await fetch(
        `${API_BASE_URL}/api/FrontOffice/public/admission/registers${query ? `?${query}` : ''}`,
        { signal, headers: { Accept: 'application/json' } }
    );

    if (!response.ok) {
        throw new Error(`Admissions request failed (${response.status})`);
    }

    const data = (await response.json()) as Partial<AdmissionBoard> | null;
    return {
        registers: data?.registers ?? [],
        total: data?.total ?? 0,
        schools: data?.schools ?? [],
        cities: data?.cities ?? []
    };
};

/** One advertised intake, for the programme page. */
export const fetchRegister = async (
    registerId: number,
    signal?: AbortSignal
): Promise<AdmissionRegister | null> => {
    const response = await fetch(`${API_BASE_URL}/api/FrontOffice/public/admission/registers/${registerId}`, {
        signal,
        headers: { Accept: 'application/json' }
    });

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        throw new Error(`Intake request failed (${response.status})`);
    }

    return (await response.json()) as AdmissionRegister;
};

/** Raises an admission enquiry against one register. */
export const submitAdmissionEnquiry = async (
    code: string,
    request: AdmissionEnquiryRequest,
    signal?: AbortSignal
): Promise<AdmissionEnquiryResult> => {
    const response = await fetch(
        `${API_BASE_URL}/api/FrontOffice/public/admission/${encodeURIComponent(code)}/enquiries`,
        {
            method: 'POST',
            signal,
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(request)
        }
    );

    if (!response.ok) {
        throw new Error(
            await readError(response, 'We could not record your enquiry just now. Please try again.')
        );
    }

    return (await response.json()) as AdmissionEnquiryResult;
};

/**
 * Sends a marketing demo request through the public admission-enquiry
 * endpoint. This is deliberately the anonymous public endpoint rather than
 * the staff-only Front Office route: the service resolves the configured
 * client and writes the resulting record to FOAdmEnquiry itself.
 */
export const submitDemoEnquiry = async (
    request: DemoEnquiryRequest,
    signal?: AbortSignal
): Promise<AdmissionEnquiryResult> => {
    const clientCode = ((import.meta as { env?: Record<string, string> }).env
        ?.VITE_DEMO_ADMISSION_CLIENT_CODE ?? '101').trim();

    if (!clientCode) {
        throw new Error('Demo enquiries are not configured yet. Please contact us directly.');
    }

    const response = await fetch(
        `${API_BASE_URL}/api/FrontOffice/public/admission/${encodeURIComponent(clientCode)}/website-demo`,
        {
            method: 'POST',
            signal,
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({
                fullName: request.fullName,
                email: request.email,
                phone: request.phone,
                organisationName: request.organisationName,
                message: request.message,
                numberOfPersons: request.numberOfPersons,
                entityId: request.entityId
            })
        }
    );

    if (!response.ok) {
        throw new Error(await readError(response, 'We could not record your demo request just now.'));
    }

    return (await response.json()) as AdmissionEnquiryResult;
};

/**
 * Looks up an enquiry by its reference. Returns null when the reference is not
 * recognised, which is the common case of a mistyped token rather than a fault.
 */
export const fetchAdmissionStatus = async (
    code: string,
    token: string,
    signal?: AbortSignal
): Promise<AdmissionStatus | null> => {
    const response = await fetch(
        `${API_BASE_URL}/api/FrontOffice/public/admission/${encodeURIComponent(code)}/status/${encodeURIComponent(token)}`,
        { signal, headers: { Accept: 'application/json' } }
    );

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        throw new Error(await readError(response, 'We could not check that reference just now.'));
    }

    return (await response.json()) as AdmissionStatus;
};
