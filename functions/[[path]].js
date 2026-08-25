export function onRequest({ request, env }) {
  const url = new URL(request.url);

  if (url.pathname === '/attendee') {
    url.pathname = '/attendee/';
    return Response.redirect(url, 308);
  }

  return env.ATTENDEE.fetch(request);
}
