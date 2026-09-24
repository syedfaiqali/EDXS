/**
 * Free trial sign-up, written against the EDXS gateway's client endpoints.
 *
 * A trial account is an ordinary client record with a campus and a login user
 * attached - the same shape the back office's New Client screen submits - so
 * nothing here is trial-specific on the server. The fifteen day limit is a
 * promise made on the form, not yet a column on the record, so a trial that is
 * created stays live until someone retires it.
 */

// import.meta.env is injected by Vite; guarded so the module can also be loaded
// outside a Vite build (tests, tooling) without blowing up at import time.
const API_BASE_URL = ((import.meta as { env?: Record<string, string> }).env?.VITE_API_BASE_URL
    ?? 'http://localhost:5001').replace(/\/$/, '');

/** How many days a trial account is advertised to last. */
export const TRIAL_DAYS = 15;

/**
 * Where a new trial account signs in. Set `VITE_APP_LOGIN_URL` per deployment;
 * the fallback points at the shared demo instance, so a build without that
 * variable still sends people somewhere they can use their new login.
 */
export const trialLoginUrl = (): string =>
    (import.meta as { env?: Record<string, string> }).env?.VITE_APP_LOGIN_URL
    || 'http://demo.kcompute.com:8061/login';

/** One entry of a country/state/city or module lookup list. */
export interface TrialLookup {
    id: number;
    code: string;
    name: string;
}

/** What the availability check says about a name the visitor typed. */
export interface TrialAvailability {
    clientNameTaken: boolean;
    clientNameSuggestion: string;
    userNameTaken: boolean;
    userNameSuggestion: string;
}

/** Everything the trial form collects, before it is shaped for the server. */
export interface TrialSignupRequest {
    clientName: string;
    description: string;
    contactPerson: string;
    contactNo: string;
    email: string;
    address: string;
    countryId: number | null;
    stateId: number | null;
    cityId: number | null;
    campusName: string;
    userName: string;
    password: string;
    fullName: string;
    mobile: string;
    moduleIds: number[];
}

/** The created client, as much of it as the confirmation screen needs. */
export interface TrialSignupResult {
    id: number;
    clientName: string;
    /** The short code the deployment generated for the new client. */
    clientCode: string;
    userName: string;
    /** When the advertised trial period runs out, as an ISO date. */
    trialEndsOn: string;
}

/**
 * Turns a failed response into a message worth showing. The trial endpoints
 * answer with `{ error }` on the paths that reject a request. A 401/403 should
 * not happen - the endpoints are anonymous - so it means the deployment has not
 * been updated with them, which the visitor cannot fix.
 */
const describeFailure = async (response: Response): Promise<string> => {
    if (response.status === 401 || response.status === 403) {
        return 'Trial sign-up is not enabled on this server yet. Please contact us to arrange your trial.';
    }

    if (response.status === 429) {
        return 'Too many trial sign-ups from this connection. Please wait a minute and try again.';
    }

    try {
        const body = await response.json() as { error?: string; title?: string };
        if (body?.error) return body.error;
        if (body?.title) return body.title;
    } catch {
        // A non-JSON body (a gateway error page, say) leaves the generic message.
    }

    return 'We could not start your trial just now. Please try again in a moment.';
};

const getLookup = async (path: string, signal?: AbortSignal): Promise<TrialLookup[]> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/public/trial/${path}`, {
        headers: { Accept: 'application/json' },
        signal
    });

    if (!response.ok) {
        throw new Error(await describeFailure(response));
    }

    return await response.json() as TrialLookup[];
};

/** The modules a trial account can be given access to. */
export const fetchTrialModules = (signal?: AbortSignal): Promise<TrialLookup[]> =>
    getLookup('lookups/modules', signal);

export const fetchTrialCountries = (signal?: AbortSignal): Promise<TrialLookup[]> =>
    getLookup('lookups/countries', signal);

export const fetchTrialStates = (countryId: number, signal?: AbortSignal): Promise<TrialLookup[]> =>
    getLookup(`lookups/states?countryId=${countryId}`, signal);

export const fetchTrialCities = (stateId: number, countryId: number, signal?: AbortSignal): Promise<TrialLookup[]> =>
    getLookup(`lookups/cities?stateId=${stateId}&countryId=${countryId}`, signal);

/**
 * Whether the organisation name and username are still free. The server also
 * enforces this on create; checking here lets the visitor fix a clash before
 * filling the rest of the form, and hands back a suggestion to accept.
 */
export const checkTrialAvailability = async (
    clientName: string,
    userName: string,
    signal?: AbortSignal
): Promise<TrialAvailability> => {
    const query = new URLSearchParams();
    if (clientName.trim()) query.set('clientName', clientName.trim());
    if (userName.trim()) query.set('userName', userName.trim());

    const response = await fetch(
        `${API_BASE_URL}/api/auth/public/trial/availability?${query.toString()}`,
        { headers: { Accept: 'application/json' }, signal }
    );

    if (!response.ok) {
        throw new Error(await describeFailure(response));
    }

    return await response.json() as TrialAvailability;
};

/** The date the trial being started would run out, as an ISO date string. */
export const trialEndDate = (from: Date = new Date()): string => {
    const end = new Date(from);
    end.setDate(end.getDate() + TRIAL_DAYS);
    return end.toISOString().slice(0, 10);
};

/**
 * Creates the trial client, its campus and its login user in one call. The
 * description records that the account came from the website's trial form and
 * when the advertised period ends, so the back office can tell trial accounts
 * from ones its own staff created.
 */
export const startFreeTrial = async (
    request: TrialSignupRequest,
    signal?: AbortSignal
): Promise<TrialSignupResult> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/public/trial`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        signal,
        // The flat shape the public endpoint accepts. It builds the client and
        // campus user itself, and stamps the trial note and expiry on the
        // record, so neither is sent from here.
        body: JSON.stringify({
            clientName: request.clientName.trim(),
            description: request.description.trim(),
            contactPerson: request.contactPerson.trim(),
            contactNo: request.contactNo.trim(),
            email: request.email.trim(),
            address: request.address.trim(),
            countryId: request.countryId,
            stateId: request.stateId,
            cityId: request.cityId,
            campusName: request.campusName.trim(),
            userName: request.userName.trim(),
            password: request.password,
            fullName: request.fullName.trim(),
            mobile: request.mobile.trim(),
            moduleIds: request.moduleIds
        })
    });

    if (!response.ok) {
        throw new Error(await describeFailure(response));
    }

    const created = await response.json() as {
        id?: number;
        clientName?: string;
        clientCode?: string;
        userName?: string;
        trialEndsOn?: string;
    };

    return {
        id: created?.id ?? 0,
        clientName: created?.clientName || request.clientName.trim(),
        clientCode: created?.clientCode ?? '',
        userName: created?.userName || request.userName.trim(),
        // The server is the authority on when the trial ends; the local
        // calculation is only a fallback if an older build answers.
        trialEndsOn: created?.trialEndsOn || trialEndDate()
    };
};
