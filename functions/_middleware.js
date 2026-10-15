export function onRequest({ request, next }) {
  const host = new URL(request.url).hostname;

  if (host !== "blog.3therea1.dev") {
    return new Response("Not found", { status: 404 });
  }

  return next();
}
