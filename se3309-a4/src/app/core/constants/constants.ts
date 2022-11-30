const serverPrefix = `${window.location.protocol}//${window.location.hostname}:3000/api/v1`;

export const Constants = {
  apiPaths: {
    default: `${serverPrefix}`,
    credentials: `${serverPrefix}/user`,
    announcements: `${serverPrefix}/announcement`
  }
}
