export function getDeploymentBadge(status: string) {
    let statusBadge;
    switch (status) {
    case 'pending':
    case 'scheduled':
    case 'queued':
        statusBadge = status + '-fd5d00';
        break;
    case 'starting':
        statusBadge = status + '-yellow';
        break;
    case 'running':
        statusBadge = status + '-brightgreen';
        break;
    case 'failed':
    case 'error':
        statusBadge = status + '-red';
        break;
    case 'dead':
    case 'draining':
    case 'complete':
        statusBadge = status + '-lightgrey';
        break;
    default:
        statusBadge = 'unknown-lightgrey';
        break;
    }
    return statusBadge;
}
