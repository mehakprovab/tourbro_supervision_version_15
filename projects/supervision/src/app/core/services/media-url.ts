const DEV_PATH_PATTERN = /(^|\/)dev(\/|$)/i;

function browserLocation(): Location | null {
  return typeof window === 'undefined' ? null : window.location;
}

export function isDevDeployment(): boolean {
  const location = browserLocation();

  if (!location) {
    return false;
  }

  return DEV_PATH_PATTERN.test(location.pathname)
    || location.hostname === 'localhost'
    || location.hostname === '127.0.0.1';
}

export function staticUploadBaseUrl(): string {
  const location = browserLocation();
  const origin = location ? location.origin : 'https://tourbro.com';
  const deploymentPath = isDevDeployment() ? '/dev' : '';

  return `${origin}${deploymentPath}/node/dist/apps/supervision/`;
}

export function resolveStaticUploadUrl(value: string): string {
  if (!value) {
    return '';
  }

  const url = String(value).trim();

  if (/^(https?:|data:|blob:)/i.test(url)) {
    return url;
  }

  // API responses are not consistent: some contain only the file path while
  // others contain the old static-root prefix. Normalise both forms here.
  const relativePath = url
    .replace(/^\/+/, '')
    .replace(/^(?:dev\/)?node\/dist\/apps\/supervision\//i, '');

  return `${staticUploadBaseUrl()}${relativePath}`;
}

export function supervisionApiBaseUrl(): string {
  const location = browserLocation();
  const protocol = location ? location.protocol : 'https:';
  const hostname = location && !['localhost', '127.0.0.1'].includes(location.hostname)
    ? location.hostname
    : 'tourbro.com';
  const port = isDevDeployment() ? 3001 : 2001;

  return `${protocol}//${hostname}:${port}/sa`;
}

export function joinUrl(baseUrl: string, path: string): string {
  return `${baseUrl.replace(/\/+$/, '')}/${String(path || '').replace(/^\/+/, '')}`;
}
